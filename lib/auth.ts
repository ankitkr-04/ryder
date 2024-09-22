import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { fetchAPI } from "./fetch";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signIn, signUp, setActive } =
      await startOAuthFlow({
        redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
          scheme: "ryder",
        }),
      });

    if (createdSessionId) {
      setActive!({ session: createdSessionId });

      if (signUp.create) {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: `${signUp.firstName} ${signUp.lastName}`,

            email: signUp.emailAddress,
            clerkId: signUp.createdUserId,
          }),
        });
      }

      return {
        success: true,
        code: "success",
        message: "OAuth success",
      };
    }

    return {
      success: false,
      code: "error",
      message: "Something Went Wrong",
    };
  } catch (err: any) {
    return {
      success: false,
      code: err.code,
      message: err?.error[0]?.message,
    };
  }
};
