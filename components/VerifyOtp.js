// components/VerifyOtp.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { generateOtp, sendEmailOtp, sendSmsOtp } from "../utils/otpUtil"; // Ensure this is correctly adapted for your use

function VerifyOtp({ route, navigation }) {
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [retry, setRetry] = useState(2);
  const [disableResend, setDisableResend] = useState(false);
  const [resendMessage, setResendMessage] = useState({
    message: "",
    visible: false,
  });
  const [fadeOut, setFadeOut] = useState(false);

  // Retrieve user data from UserContext
  const { user, updateUser } = useUser();

  const handleVerifyOtp = () => {
    // Compare input OTPs with stored OTPs in context
    if (
      phoneOtp === String(user.phoneOtp) &&
      emailOtp === String(user.emailOtp)
    ) {
      setStatusMessage("OTP verification successful!");
      setIsVerified(true);
      setDisableResend(true);
      setPhoneOtp("");
      setEmailOtp("");

      // Update verification status in context
      updateUser({
        emailVerified: true,
        phoneVerified: true,
      });
    } else {
      setStatusMessage("Failed to verify OTPs. Please try again.");
      setIsVerified(false);
    }
  };

  const handleResendOtp = async () => {
    if (retry > 0) {
      setDisableResend(true);
      setRetry(retry - 1);
      setStatusMessage("");

      // Regenerate OTPs and update context
      const newPhoneOtp = generateOtp();
      const newEmailOtp = generateOtp();

      await sendSmsOtp(user.phone, newPhoneOtp);
      await sendEmailOtp(user.email, newEmailOtp);

      updateUser({
        phoneOtp: newPhoneOtp,
        emailOtp: newEmailOtp,
        emailOtpExpiration: new Date(Date.now() + 5 * 60000),
        phoneOtpExpiration: new Date(Date.now() + 5 * 60000),
      });

      setResendMessage({ message: "OTPs resent successfully.", visible: true });
      setFadeOut(false);

      // Disable resend for 10 seconds
      setTimeout(() => {
        setDisableResend(false);
      }, 10000);

      // Fade-out effect for the resend message
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setResendMessage({ message: "", visible: false });
        }, 500);
      }, 5000);
    } else {
      setResendMessage({
        message: "Max attempts reached. Please try later.",
        visible: true,
      });
      setStatusMessage("Max attempts reached. Please try later.");
      setDisableResend(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      {/* Phone OTP Input */}
      <TextInput
        style={[styles.input, styles.inputOtp]}
        placeholder="Phone OTP"
        keyboardType="numeric"
        value={phoneOtp}
        onChangeText={setPhoneOtp}
      />

      {/* Email OTP Input */}
      <TextInput
        style={[styles.input, styles.inputOtp]}
        placeholder="Email OTP"
        keyboardType="numeric"
        value={emailOtp}
        onChangeText={setEmailOtp}
      />

      {/* Verify OTP Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Verify OTP"
          onPress={handleVerifyOtp}
          disabled={!phoneOtp || !emailOtp}
        />
      </View>

      {/* Resend OTP Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Resend OTP"
          onPress={handleResendOtp}
          disabled={disableResend}
        />
      </View>

      {/* Status Messages */}
      {statusMessage ? (
        <Text
          style={[styles.statusText, { color: isVerified ? "green" : "red" }]}
        >
          {statusMessage}
        </Text>
      ) : null}

      {/* Resend message with transition */}
      {resendMessage.visible ? (
        <Text style={[styles.resendMessage, { opacity: fadeOut ? 0 : 1 }]}>
          {resendMessage.message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  inputOtp: {
    height: 40,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  statusText: {
    textAlign: "center",
    marginTop: 10,
  },
  resendMessage: {
    textAlign: "center",
    marginTop: 10,
    color: "green",
  },
});

export default VerifyOtp;
