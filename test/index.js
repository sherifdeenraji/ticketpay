const url = 'https://securewaveng.com/api/virtual_accounts/generate'

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Authorization': 'Bearer bcc6cb0b37a05950f2417707c3ed58504e4d1e179c8d0ee4115b54e0a10446d8',
    'x-api-key': '73342a841e363df201fb4af46d258ad2cdf5dc781093c7ca0f1a22219a27',
  },
  body: JSON.stringify({
    "email": "sherifdeenraji96@gmail.com",
    "first_name": "SHERIFDEEN",
    "last_name": "RAJI",
    "phone_number": "08118448441",
    "bank_code": [1],
    "business_id": "5ab7b97bdad692fc588d62fd26b3b0c4fbe7f12b",
    "account_type": "static",
    "id_type": "bvn",
    "id_number": "22528601601",
  }),
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))

{
  status: true,
  message: '1 out of 1 virtual account(s) generated',
  data: [
    {
      account_number: '0994314038',
      bank_code: 1,
      account_name: 'SECUREWAVENG/ticketPa SHERI RA',
      account_bank: 'KOLOMONI MFB',
      account_email: 'sherifdeenraji96@gmail.com',
      account_reference: 'SecurewaveNg|Va|17811007577467932019',
      status: 1,
      category: 'static',
      metadata: null
    }
  ]
}