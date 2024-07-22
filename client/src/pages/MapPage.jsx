import React, { useState } from 'react';
import { Box, FormControl, Input, Flex, IconButton, Center } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import MapView from '../components/MapView';
import SearchHistory from '../components/SearchHistory';
import { useDispatch } from 'react-redux';
import { searchLocation } from '../features/maps/mapSlice';
import { useFormik } from 'formik';
import { object, string } from 'yup';

const MapPage = () => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [keepVisible, setKeepVisible] = useState(false);

  const formik = useFormik({
    initialValues: { searchTerm: '' },
    validationSchema: object({
      searchTerm: string().required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(searchLocation(values.searchTerm));
      setIsFocused(false);
    },
  });

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!keepVisible) setIsFocused(false);
  };

  const handleMouseEnter = () => setKeepVisible(true);
  const handleMouseLeave = () => {
    setKeepVisible(false);
    setIsFocused(false);
  };

  return (
    <Box height="100vh" width="100vw" display="flex" flexDirection="column">
      <Flex
        as="header"
        align="center"
        justify="center"
        p={4}
        bg="white"
        boxShadow="md"
        zIndex="2"
        position="relative"
      >
        <Box as="form" onSubmit={formik.handleSubmit} display="flex" alignItems="center" >
          <FormControl id="searchTerm" isInvalid={formik.errors.searchTerm && formik.touched.searchTerm} mr={2}>
            <Input
              type="text"
              name="searchTerm"
              onChange={formik.handleChange}
              value={formik.values.searchTerm}
              placeholder="Enter location"
              onFocus={handleFocus}
              onBlur={handleBlur}
              width="300px"
            />
          </FormControl>
          <IconButton
            type="submit"
            aria-label="Search"
            icon={<SearchIcon />}
            colorScheme="blue"
          />
          {isFocused && (
            <Box
              position="absolute"
              top="calc(100% + 4px)" 
              left="0"
              right="0"
              zIndex="8"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              mt={2}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <SearchHistory isVisible={isFocused} />
            </Box>
          )}
        </Box>
      </Flex>
      <Box mt={16} overflowX="hidden" position="absolute"zIndex="1">
        <MapView />
      </Box>
    </Box>
  );
};

export default MapPage;
