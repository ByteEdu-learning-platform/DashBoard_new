export type ProductFormData = {
  title: string;
  category: string;
  description: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<ProductFormData[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<ProductFormData>(`/products/${id}`);
  }

  async createProduct(ProductData: ProductFormData) {
    return this.fetch<ProductFormData>("/products", {
      method: "POST",
      body: ProductData,
    });
  }

  async updateProduct(id: string, ProductData: Partial<ProductFormData>) {
    return this.fetch<ProductFormData>(`/products/${id}`, {
      method: "PUT",
      body: ProductData,
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
