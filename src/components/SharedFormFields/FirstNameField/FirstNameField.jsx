// import React from "react";
// import { useField } from "formik";
// import * as yup from "yup";
// import TextField from "@mui/material/TextField";
// import PropTypes from "prop-types";

// // Local validation schema for the lastname field
// const lastnameValidationSchema = yup.object({
//     lastname: yup.string("Enter your last name").required("Last name is required"),
// });

// function LastNameField({ name }) {
//     // Formik's useField hook with local validation
//     const [field, meta] = useField({
//         name,
//         validate: async (value) => {
//             try {
//                 await lastnameValidationSchema.validateAt(name, { [name]: value });
//             } catch (error) {
//                 return error.message;
//             }
//         },
//     });

//     const configTextField = {
//         ...field,
//         fullWidth: true,
//         variant: "outlined",
//         label: "Last Name",
//         error: Boolean(meta && meta.touched && meta.error), // Determines the error state
//         helperText: meta.touched && meta.error ? meta.error : "", // Displays the error message
//     };

//     return <TextField {...configTextField} />;
// }

// LastNameField.propTypes = {
//     name: PropTypes.string.isRequired, // Name of the field to be used with Formik, should be 'lastname'.
// };

// export default LastNameField;
