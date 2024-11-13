// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import classes from './Button.module.css';

// function CreateButton(){
//     return(
//         <Stack spacing={2} direction="row">
//         {/* <Button variant="text">Text</Button>
//         <Button variant="contained">Contained</Button> */}
//         <Button className={classes.button} variant="outlined">Create a Project</Button>
//       </Stack>
//     )
// }

// export default CreateButton;

// components/ReusableButton.js
import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import classes from './Button.module.css';

function ReusableButton({ variant = "outlined", onClick, children }) {
    return (
        <Button className={classes.button} variant={variant} onClick={onClick}>
            {children}
        </Button>
    );
}

ReusableButton.propTypes = {
    variant: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default ReusableButton;
