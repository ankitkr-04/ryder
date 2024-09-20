import { Link, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View>
        <Text>This Screen doesn't exists</Text>
        <Link href={"/"}>
          <Text>Go to Home</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
