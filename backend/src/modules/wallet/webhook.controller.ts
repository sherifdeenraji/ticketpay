import { Request, Response } from 'express';
import crypto from 'crypto';
import { walletService } from './wallet.service.js';
import { config } from '../../config/env.js';

export const webhookController = {
    handleSecureWave: async (req: Request, res: Response) => {
        try {
            const signature = req.headers['x-signature'] as string;
            
            if (!signature) {
                console.warn('Webhook received without signature');
                return res.status(401).send('Missing signature');
            }

            // Verify HMAC-SHA256 signature
            const hmac = crypto.createHmac('sha256', config.SECUREWAVE.WEBHOOK_SECRET as string);
            const rawBody = JSON.stringify(req.body);
            const expectedSignature = hmac.update(rawBody).digest('hex');

            // Use timingSafeEqual to prevent timing attacks
            const signatureBuffer = Buffer.from(signature, 'hex');
            const expectedBuffer = Buffer.from(expectedSignature, 'hex');

            if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
                console.error('Invalid webhook signature');
                return res.status(401).send('Invalid signature');
            }

            const payload = req.body;
            console.log('Valid SecureWave Webhook received:', payload.notification_status);

            // Handle successful payment
            if (payload.notification_status === 'payment_successful' || payload.transaction_status === 'success') {
                const accountNumber = payload.receiver?.account_number;
                const amount = payload.amount;

                if (!accountNumber) {
                    console.error('Webhook missing receiver account_number');
                    return res.status(400).send('Missing account number');
                }

                // Credit the wallet matched by virtual account number
                const result = await walletService.creditWalletByAccountNumber(
                    accountNumber,
                    amount,
                    payload
                );

                if (!result) {
                    console.error('No wallet found for account:', accountNumber);
                    return res.status(404).send('Wallet not found');
                }

                console.log(`Wallet credited: ₦${amount} to account ${accountNumber}`);
            }

            // Always respond with 200 OK to acknowledge receipt
            res.status(200).send('Webhook processed');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Internal processing error');
        }
    }
};
