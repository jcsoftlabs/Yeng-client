const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
    private token: string | null = null;
    public baseURL: string = API_URL;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('customer_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('customer_token');
        }
    }

    async request(endpoint: string, options: RequestInit = {}) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const data = await this.request('/auth/customer-login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.access_token);
        return data;
    }

    async register(customerData: any) {
        const data = await this.request('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData),
        });
        return data;
    }

    // Public tracking
    async trackParcel(trackingNumber: string) {
        return this.request(`/parcels/track/${trackingNumber}`);
    }

    // Customer endpoints
    async getProfile() {
        return this.request('/customers/me');
    }

    async updateProfile(data: any) {
        return this.request('/customers/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async getParcels(filters?: any) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/parcels${params ? `?${params}` : ''}`);
    }

    async getParcel(id: string) {
        return this.request(`/parcels/${id}`);
    }

    async getInvoices() {
        return this.request('/invoices');
    }

    async getInvoice(id: string) {
        return this.request(`/invoices/${id}`);
    }

    async downloadInvoicePDF(id: string, invoiceNumber: string) {
        const response = await fetch(`${API_URL}/invoices/${id}/pdf`, {
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
        });

        if (!response.ok) throw new Error('Failed to download PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${invoiceNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

export const api = new ApiClient();
