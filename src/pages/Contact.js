import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import { data } from 'react-router-dom';

const ContactSection = styled.section`
  padding: 5rem 10%;
`;

const ContactForm = styled(motion.form)`
  display: grid;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  resize: vertical;
`;

const SubmitButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00b8cc;
  }
`;

const Contact = () => {
  const { register, reset, handleSubmit } = useForm();
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const accessKey = "89834c80-96b2-4cac-8e7e-674236ce9bba";
    console.log(data)
  const { submit: onSubmit } = useWeb3Forms({
    access_key: accessKey,
    settings: {
      from_name: "Kaizen Labs",
      subject: "New Message from Contact Form",
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true);
      setResult(msg);
      reset();
    },
    onError: (msg, data) => {
      setIsSuccess(false);
      setResult(msg);
    },
  });
console.log(result)
  return (
    <ContactSection>
      <h2>Contact Us</h2>
      <ContactForm
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          type="text"
          required
          {...register("name", { required: true })}
          placeholder="Name"
        />
        <Input
          type="email"
          required
          {...register("email", { required: true })}
          placeholder="Email"
        />
        <TextArea
          required
          {...register("message", { required: true })}
          placeholder="Message"
        />
        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </SubmitButton>
      </ContactForm>
      <div>{result}</div>
    </ContactSection>
  );
};

export default Contact;
