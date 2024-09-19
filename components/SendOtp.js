// components/SendOtp.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import { generateOtp, sendEmailOtp, sendSmsOtp } from "../utils/otpUtil"; // Ensure this is correctly adapted for your use

function SendOtp({ navigation }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [otpText, setOtpText] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");

  const { updateUser } = useUser();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{12}$/;

  const handlePhone = (phone) => {
    setPhone(phone);
    setPhoneError(!phoneRegex.test(phone));
  };

  const handleEmail = (email) => {
    setEmail(email);
    setEmailError(!emailRegex.test(email));
  };

  useEffect(() => {
    if (!phoneError && !emailError && phone && email) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [phone, email, phoneError, emailError]);

  const handleSendOtp = async () => {
    setOtpText("Sending OTPs. Please wait...");
    const phoneOtp = generateOtp();
    const emailOtp = generateOtp();

    try {
      setLoading(true);
      await sendSmsOtp(phone, phoneOtp);
      await sendEmailOtp(email, emailOtp);
      setDisableButton(true);
      setOtpText("OTPs sent! Taking you to the verification screen.");
      updateUser({
        email,
        phone,
        emailOtp,
        phoneOtp,
        emailOtpExpiration: Date.now() + 300000,
        phoneOtpExpiration: Date.now() + 300000,
      });
      setTimeout(() => {
        navigation.navigate("VerifyOtp", { email, phone });
      }, 3000);
    } catch (error) {
      setOtpText("");
      setNetworkError("Failed to send OTP. Please try again after some time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register with 1Fi</Text>

      {/* Phone Input with Validation */}
      <TextInput
        style={[styles.input, phoneError && styles.inputError]}
        placeholder="Enter Phone"
        keyboardType="numeric"
        value={phone}
        onChangeText={handlePhone}
      />
      {phoneError && (
        <Text style={styles.errorText}>
          Please enter a valid 10-digit phone number with country code
        </Text>
      )}

      {/* Email Input with Validation */}
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Enter Email"
        keyboardType="email-address"
        value={email}
        onChangeText={handleEmail}
      />
      {emailError && (
        <Text style={styles.errorText}>Please enter a valid email address</Text>
      )}

      {/* Send OTP Button */}
      <Button
        title={loading ? "Sending OTP..." : "Send OTP"}
        onPress={handleSendOtp}
        disabled={phoneError || emailError || disableButton || loading}
      />

      <Text style={[styles.otpText, { opacity: otpText ? 1 : 0 }]}>
        {otpText}
      </Text>

      {networkError && <Text style={styles.networkError}>{networkError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
  otpText: {
    textAlign: "center",
    color: "green",
    transition: "opacity 1s ease-in-out",
  },
  networkError: { textAlign: "center", color: "red" },
});

export default SendOtp;
