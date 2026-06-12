import axios from "axios";
import { config } from "./env.js";

const securewaveApi = axios.create({
  baseURL: config.SECUREWAVE.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${config.SECUREWAVE.SECRET_KEY}`,
    'x-api-key': config.SECUREWAVE.API_KEY,
  },
});

export interface VirtualAccountResult {
  account_number: string;
  account_name: string;
  account_reference: string;
  bank_name: string;
}

export const createNewVirtualAccount = async (
  email: string,
  firstName: string,
  lastName: string,
  phone: string
): Promise<VirtualAccountResult> => {
  const response = await securewaveApi.post('/virtual_accounts/generate', {
    email,
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
    bank_code: [1],
    business_id: config.SECUREWAVE.BUSINESS_ID,
    account_type: 'static',
    id_type: 'bvn',
    id_number: config.SECUREWAVE.BVN,
  });

  if (!response.data?.status || !response.data?.data?.[0]) {
    throw new Error('Failed to generate virtual account: Invalid response from SecureWave');
  }

  const account = response.data.data[0];
  return {
    account_number: account.account_number,
    account_name: account.account_name,
    account_reference: account.account_reference,
    bank_name: account.account_bank, // API returns 'account_bank', we store as 'bank_name'
  };
};
