import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  Center,
  useToast,
} from '@chakra-ui/react';

const AuthForm = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const toast = useToast();

  useEffect(() => {
    if (authStatus === 'succeeded' && type === 'register') {
      toast({
        title: 'Registration successful',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } else if (authStatus === 'succeeded' && type === 'login') {
      navigate('/map');
    } else if (authStatus === 'failed' && authError) {
      toast({
        title: 'Error',
        description: authError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [authStatus, authError, navigate, toast, type]);

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().min(6, 'Password must include atleast 6 characters!').required('Required'),
    ...(type === 'register' && {
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: (values) => {
      if (type === 'register') {
        dispatch(register(values));
      } else {
        dispatch(login(values));
      }
    },
  });

  return (
    <Center>
       <Box 
        maxW="400px" 
        p={6} 
        borderRadius='6px'
        bgGradient={[
          'linear(to-tr, teal.300, yellow.400)',
          'linear(to-t, blue.200, teal.500)',
          'linear(to-b, orange.100, purple.300)',
        ]} 
        >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        {type === 'register' ? 'Register' : 'Login'}
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.touched.password && formik.errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          {type === 'register' && (
            <FormControl
              isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
            >
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
            </FormControl>
          )}
          <Button type="submit" 
           variant="outline"
           m={4}
           p={2}
           color="gray.800"
           fontWeight="bold"
           borderRadius="md"
           bgGradient={[
               'linear(to-tr, teal.300, yellow.400)',
               'linear(to-t, blue.200, teal.500)',
               'linear(to-tr, orange.100, purple.300)',
           ]}
           _hover={{
               bgGradient: 'linear(to-tr, purple.300, orange.100,)',
           }}>
            {type === 'register' ? 'Register' : 'Login'}
          </Button>
        </VStack>
      </form>
    </Box>
    </Center>
  );
};



export default AuthForm;
