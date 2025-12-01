const apiUrl = import.meta.env.VITE_API_BASE_URL;

console.log(apiUrl);

interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// Helper function to parse images field (can be string, array, or null)
export function parseImages(images: any): string[] {
    if (!images) return [];
    
    // If it's already an array, clean and return it
    if (Array.isArray(images)) {
        return images
            .map(img => {
                if (typeof img === 'string') {
                    // Remove any surrounding quotes or brackets
                    return img.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
                }
                return img;
            })
            .filter(img => img && img.length > 0);
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof images === 'string') {
        const trimmed = images.trim();
        
        // If it looks like a JSON array string, try to parse it
        if (trimmed.startsWith('[') || trimmed.startsWith('"')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed
                        .map(img => {
                            if (typeof img === 'string') {
                                // Clean up any extra quotes or brackets
                                return img.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
                            }
                            return img;
                        })
                        .filter(img => img && img.length > 0);
                }
                // If parsed is a string, clean it and return as array
                if (typeof parsed === 'string') {
                    const cleaned = parsed.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
                    return cleaned ? [cleaned] : [];
                }
            } catch (e) {
                // If parsing fails, try to extract path from the string
                // Remove brackets and quotes
                const cleaned = trimmed.replace(/^["'\[\]]+|["'\[\]]+$/g, '').trim();
                return cleaned ? [cleaned] : [];
            }
        }
        
        // If it's a plain string path, return it as array
        return [trimmed];
    }
    
    return [];
}

// Helper function to convert relative image paths to full URLs
export function getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/placeholder.svg';
    
    // Clean the path - remove any invalid characters
    const cleaned = imagePath.trim();
    
    // If the cleaned path is too short or contains only brackets/quotes, return placeholder
    if (cleaned.length < 2 || /^[\[\]{}"'`]+$/.test(cleaned)) {
        return '/placeholder.svg';
    }

    // If it's already a full URL, return as is
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned;
    }

    // Get the API base URL from environment variable
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    // If it starts with /uploads, prepend the API URL
    if (cleaned.startsWith('/uploads')) {
        return `${apiUrl}${cleaned}`;
    }

    // If it starts with /, prepend the API URL
    if (cleaned.startsWith('/')) {
        return `${apiUrl}${cleaned}`;
    }

    // Otherwise, assume it's a relative path and prepend /uploads/
    return `${apiUrl}/uploads/${cleaned}`;
}
// Helper function to build query strings
function buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}

// function helper to make api calls
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const token = localStorage.getItem('token');

        // Don't set Content-Type for FormData, let the browser set it with boundary
        const isFormData = options.body instanceof FormData;
        const headers: HeadersInit = {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        };

        const response = await fetch(`${apiUrl}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || data.message || 'Request failed' };
        }

        return { data };
    } catch (error) {
        return { error: 'Network error occurred' };
    }
}

// ==================== AUTH APIs ====================
export const authApi = {
    register: (full_name: string, email: string, phone: string, password: string) => 
        apiRequest<{ user: any; token?: string }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ full_name, email, phone, password }),
        }),
    login: (email: string, password: string) => 
        apiRequest<{ token: string; user: any }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    logout: () => localStorage.removeItem('token'),
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },
}

// ==================== USER APIs ====================
export const usersApi = {
    getProfile: () => apiRequest('/api/users/profile'),
    updateProfile: (data: { full_name?: string; phone?: string }) => 
        apiRequest('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    changePassword: (current_password: string, new_password: string) => 
        apiRequest('/api/users/change-password', {
            method: 'PUT',
            body: JSON.stringify({ current_password, new_password }),
        }),
    getAddresses: () => apiRequest('/api/users/addresses'),
    addAddress: (data: { label: string; country: string; city: string; street: string; postal_code?: string; is_default?: boolean }) => 
        apiRequest('/api/users/addresses', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateAddress: (id: string, data: { label?: string; country?: string; city?: string; street?: string; postal_code?: string; is_default?: boolean }) => 
        apiRequest(`/api/users/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    deleteAddress: (id: string) => 
        apiRequest(`/api/users/addresses/${id}`, {
            method: 'DELETE',
        }),
    getOrders: (params?: { page?: number; limit?: number }) => 
        apiRequest(`/api/users/orders${buildQueryString(params || {})}`),
}

// ==================== CART APIs ====================
export const cartApi = {
    getCart: () => apiRequest('/api/cart'),
    addToCart: (product_type: 'part' | 'merch', product_id: string, quantity: number) => 
        apiRequest('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_type, product_id, quantity }),
        }),
    updateCartItem: (id: string, quantity: number) => 
        apiRequest(`/api/cart/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),
    removeFromCart: (id: string) => 
        apiRequest(`/api/cart/remove/${id}`, {
            method: 'DELETE',
        }),
    clearCart: () => 
        apiRequest('/api/cart/clear', {
            method: 'DELETE',
        }),
    getCheckoutSummary: () => apiRequest('/api/cart/checkout-summary'),
}

// ==================== ORDERS APIs ====================
export const ordersApi = {
    createOrder: (shipping_address_id: string, payment_method: string, notes?: string) => 
        apiRequest('/api/orders/create', {
            method: 'POST',
            body: JSON.stringify({ shipping_address_id, payment_method, notes }),
        }),
    getOrders: (params?: { page?: number; limit?: number; status?: string }) => 
        apiRequest(`/api/orders${buildQueryString(params || {})}`),
    getOrderDetails: (id: string) => apiRequest(`/api/orders/${id}`),
    cancelOrder: (id: string) => 
        apiRequest(`/api/orders/${id}/cancel`, {
            method: 'PUT',
        }),
    trackOrder: (id: string) => apiRequest(`/api/orders/${id}/track`),
}

// ==================== PRODUCTS APIs ====================
export const productsApi = {
    getCategories: (params?: { include_children?: 'true'; page?: number; limit?: number; sort?: string; order?: string }) => 
        apiRequest(`/api/products/categories${buildQueryString(params || {})}`),
    getCategoryDetails: (id: string, params?: { page?: number; limit?: number; sort?: string; order?: string }) => 
        apiRequest(`/api/products/categories/${id}${buildQueryString(params || {})}`),
    getManufacturers: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string;
        sort?: string;
        order?: string;
    }) => 
        apiRequest(`/api/products/manufacturers${buildQueryString(params || {})}`),
    getManufacturerDetails: (id: string, params?: { page?: number; limit?: number; sort?: string; order?: string }) => 
        apiRequest(`/api/products/manufacturers/${id}${buildQueryString(params || {})}`),
    searchParts: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        category_id?: string; 
        manufacturer_id?: string; 
        min_price?: number; 
        max_price?: number; 
        color?: string; 
        sort?: string; 
        order?: string; 
        in_stock?: boolean 
    }) => 
        apiRequest(`/api/products/parts${buildQueryString(params || {})}`),
    getPartsByCategory: (category_id: string, params?: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        manufacturer_id?: string; 
        min_price?: number; 
        max_price?: number; 
        color?: string; 
        sort?: string; 
        order?: string; 
        in_stock?: boolean 
        category_id?: string;
    }) => 
        apiRequest(`/api/products/parts${buildQueryString(params || {})}`),
    getPartDetails: (id: string) => apiRequest(`/api/products/parts/${id}`),
    getMerchandise: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        min_price?: number; 
        max_price?: number; 
        color?: string; 
        size?: string; 
        sort?: string; 
        order?: string; 
        in_stock?: boolean 
    }) => 
        apiRequest(`/api/products/merchandise${buildQueryString(params || {})}`),
    getMerchandiseDetails: (id: string) => apiRequest(`/api/products/merchandise/${id}`),
    getModels: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string;
        sort?: string;
        order?: string;
    }) => 
        apiRequest(`/api/products/models${buildQueryString(params || {})}`),
    getModelDetails: (id: string, params?: { page?: number; limit?: number; sort?: string; order?: string }) => 
        apiRequest(`/api/products/models/${id}${buildQueryString(params || {})}`),
    getModelsByMakeId: (id: string) => apiRequest(`/api/products/models/make-id/${id}`),
}

// ==================== FEEDBACK APIs ====================
export const feedbackApi = {
    getMyFeedback: (params?: { page?: number; limit?: number }) => 
        apiRequest(`/api/feedback/feedback/my${buildQueryString(params || {})}`),
    applyAsAmbassador: (data: { 
        social_links: string; 
        follower_count: number; 
        bike_brands: string; 
        application_notes?: string 
    }) => 
        apiRequest('/api/feedback/ambassadors/apply', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getMyAmbassadorApplication: () => apiRequest('/api/feedback/ambassadors/my'),
    updateAmbassadorApplication: (data: { 
        social_links?: string; 
        follower_count?: number; 
        bike_brands?: string; 
        application_notes?: string 
    }) => 
        apiRequest('/api/feedback/ambassadors/my', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    getApprovedAmbassadors: (params?: { page?: number; limit?: number }) => 
        apiRequest(`/api/feedback/ambassadors/approved${buildQueryString(params || {})}`),
}

// ==================== LEGACY APIs (for backward compatibility) ====================
export const brandsApi = {
    getAll: () => productsApi.getManufacturers(),
    getById: (id: string) => productsApi.getManufacturerDetails(id),
}

export const categoriesApi = {
    getAll: () => productsApi.getCategories(),
    getById: (id: string) => productsApi.getCategoryDetails(id),
}

export const modelsApi = {
    getAll: () => productsApi.getModels(),
    getByMakeId: (id: string) => productsApi.getModelsByMakeId(id),
}

export const partsApi = {
    getAll: () => productsApi.searchParts(),
    getById: (id: string) => productsApi.getPartDetails(id),
}

export const merchandiseApi = {
    getAll: () => productsApi.getMerchandise(),
    getById: (id: string) => productsApi.getMerchandiseDetails(id),
}

export const partnersApi = {
    getAll: () => apiRequest('/partners'),
    getById: (id: string) => apiRequest(`/partners/${id}`),
}
