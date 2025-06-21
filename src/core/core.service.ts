import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CoreService {
  constructor(private readonly httpService: HttpService) {}

  async generateAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`,
    ).toString('base64');

    const url =
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const headers = {
      Authorization: `Basic ${process.env.SAFARICOM_BASIC_AUTHORIZATION}`,
    };

    const response = await firstValueFrom(
      this.httpService.get(url, { headers }),
    );

    return response.data.access_token;
  }

  async registerUrl(): Promise<void> {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
    const accessToken = await this.generateAccessToken();

    const payload = {
      ShortCode: 600000,
      ResponseType: 'Cancelled',
      ConfirmationURL: 'https://safaripay.mouseinc.net/confirmation.php',
      ValidationURL: 'https://safaripay.mouseinc.net/validation.php',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get raw error
        console.error('Full error response:', errorDetails);
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('URL Registration Success:', result);
      return result;
    } catch (error) {
      console.error('URL Registration Failed:', error);
    }
  }

  async simulateC2B() {
    const token = await this.generateAccessToken();

    const body = {
      ShortCode: '600000',
      CommandID: 'CustomerPayBillOnline',
      Amount: 100,
      Msisdn: '254728877619', // Test number
      BillRefNumber: 'Test123',
    };

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Simulate Response:', data);
    return data;
  }
}
