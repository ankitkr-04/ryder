import { InputFieldProps } from "@/types/type";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputField = ({
  label,
  labelStyle,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  inputStyle,
  containerStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`mb-3 font-JakartaBold text-lg ${labelStyle} `}>
            {label}
          </Text>
          <View
            className={`relative flex flex-row items-center justify-start rounded-full border border-neutral-100 bg-neutral-100 focus:border-primary-500 ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`ml-4 w-6 h-6 ${iconStyle}`} />
            )}
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              className={`w-full flex-1 rounded-full p-4 text-left font-JakartaSemiBold text-[15px] ${inputStyle}`}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
