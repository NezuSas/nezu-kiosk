interface Env {
    NODE_ENV: 'development' | 'production';
    API_URL: string;
  }

export const env: Env = {
    NODE_ENV: import.meta.env.MODE as 'development' | 'production',
    API_URL: import.meta.env.VITE_API_URL as string,
};

const requiredEnvs: Array<keyof Env> = ['API_URL'];

requiredEnvs.forEach((key) => {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
});

export default env;