import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHistory, removeHistory } from '../features/maps/mapSlice';
import { Box, Button, List, ListItem, Text as ChakraText, Flex, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const SearchHistory = ({ isVisible }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.maps);

  useEffect(() => {
    dispatch(getHistory());
  }, [dispatch]);


  return (
    isVisible && (
      <Box
        position="absolute"
        bg="white"
        boxShadow="md"
        borderRadius="md"
        mt={2}
        w="full"
        zIndex="dropdown"
      >
        <List spacing={2}>
          {history.history.length ? (
            history.history.map((item) => (
              <>
              <Flex justifyContent="space-between" alignItems="center" p={2}>
                <ChakraText>{item.term}</ChakraText>
                <IconButton
                  size="xs" colorScheme="red" onClick={() => dispatch(removeHistory(item._id))}
                  aria-label="delete"
                  icon={<CloseIcon />}
                />
              </Flex>
              <hr />
              </>
            ))
          ) : (
            <ListItem p={2}>No search history</ListItem>
          )}
        </List>
      </Box>
    )
  );

  //   <div>
  //     <ul>
  //       {history.history ? (
  //         history.map((item) => (

  //           <li key={item._id}>
  //             {item.term}
  //             <button onClick={() => dispatch(removeHistory(item._id))}>Remove</button>
  //           </li>
  //         ))
  //       ) : (
  //         <li>No search history</li>
  //       )}
  //     </ul>
  //   </div>
  // );
};

export default SearchHistory;
