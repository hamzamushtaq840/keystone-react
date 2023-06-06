import * as Yup from "yup";


export const SignInSchema = Yup.object({
    email: Yup.string().email("Must be a valid email.").required("Please enter your email."),
    password: Yup.string().min(6).required("Please enter your password.")
})
export const SignUpSchema = Yup.object({
    firstname: Yup.string().min(2).max(25).required("Please enter your firsname."),
    lastname: Yup.string().min(2).max(25).required("Please enter your lastname."),
    email: Yup.string()
    .required("Please enter your email.")
    .test('is-valid-email', 'Email not valid', value =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
    password: Yup.string().min(6).required("Please enter your password."),
    password_confirmation: Yup.string().required('').oneOf([Yup.ref('password'), null], "Password must match")
})
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const CompanyDetails = Yup.object({
    dot_number: Yup.number()
    .typeError('Not a valid DOT Number').notRequired(),
    companyname: Yup.string().min(2).max(25).required("Company name is required."),
    address: Yup.string().min(2).max(160).required("Address is required."),
    country: Yup.string().required("Country is required."),
    city: Yup.string().required("City is required."),
    zipcode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Zip code is invalid')
    .required('Zip code is required'),
    state: Yup.string().required('State is required'),
    phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone Number is required."),
    timezone: Yup.string()
    // .matches(/^([A-Z][a-z]+\/){1,3}[A-Z][a-z]+$/, 'Invalid timezone format')
    .required('Timezone is required')
})

export const ForgotPassword = Yup.object({
    email: Yup.string().email("Must be a valid email.").required("Please enter your email.")
})
export const ResetPassword = Yup.object({
    password: Yup.string().min(6).required("Please enter your password."),
    password_confirmation: Yup.string().required('').oneOf([Yup.ref('password'), null], "Password must match")

})
export const InviteValidation = Yup.object({
    firstname: Yup.string().min(2).max(25).required("Enter a valid firsname."),
    lastname: Yup.string().min(2).max(25).required("Enter a valid lastname."),
    email: Yup.string().email().required("Enter an email."),
    userType: Yup.string()
    .notOneOf(["Select an option"], "Please select a user role")
    .required("Required"),
})

export const CommodityValidation = Yup.object({
    commodity_code: Yup.string().min(2).max(25).required("Commodity code is required."),
    name: Yup.string().min(2).max(25).required("Commodity name is required."),
})


export const TruckValidation = Yup.object({
    number: Yup.number().typeError('Must be a valid number').required("Truck Number is required."),
    model: Yup.number().typeError('Must be a valid number'),
    vehicle_number: Yup.number().typeError('Must be a valid number'),
    license: Yup.string(),
    state: Yup.string(),
    irp_registered: Yup.string(),
    ifta_registered: Yup.string(),
    irp_account: Yup.string(),
    ifta_account: Yup.string(),
    length: Yup.number().typeError('Must be a valid number'),
    height: Yup.number().typeError('Must be a valid number'),
    width: Yup.number().typeError('Must be a valid number'),
    number_of_axles: Yup.number().typeError('Must be a valid number'),
    unloaded_weight: Yup.number().typeError('Must be a valid number'),
    puc_oregon: Yup.string(),
    combine_weight: Yup.string(),
    net_weight: Yup.string(),
    fuel_interface: Yup.string(),
    edi_equipment: Yup.string(),
  });
  export const TrailerValidation = Yup.object({
    number: Yup.number().typeError('Must be a valid number').required("Trailer Number is required."),
    model: Yup.number().typeError('Must be a valid number'),
    vehicle_number: Yup.number().typeError('Must be a valid number'),
    length: Yup.number().typeError('Must be a valid number'),
    height: Yup.number().typeError('Must be a valid number'),
    width: Yup.number().typeError('Must be a valid number'),
    number_of_axles: Yup.number().typeError('Must be a valid number'),
    unloaded_weight: Yup.number().typeError('Must be a valid number'),
    laden_weight: Yup.number().typeError('Must be a valid number'),
  });

  export const DriverValidation = Yup.object({
    firstname: Yup.string()
      .required('First name is required'),
    lastname: Yup.string()
      .required('Last name is required'),
    drivernumber: Yup.number()
      .typeError('Driver number must be a number')
      .required('Driver number is required'),
    dob: Yup.date()
      .nullable()
      .required('Date of birth is required'),
    active_status: Yup.string(),
    fuelcardnumber: Yup.string(),
    phonenumber: Yup.number()
      .typeError('Phone number must be a number'),
      email: Yup.string().email("Must be a valid email."),
    hiredate: Yup.date()
      .nullable(),
    address: Yup.string(),
    address2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipcode: Yup.number()
      .typeError('Zip code must be a number'),
    country: Yup.string(),
    pay_to: Yup.string(),
    truck_id: Yup.string(),
    trailer_id: Yup.string(),
    licensenumber: Yup.string(),
  });