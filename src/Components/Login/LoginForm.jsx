import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error} = useSelector(state => state.auth);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password validation function
  const validatePassword = (password) => {
    // At least 6 characters, 1 number, 1 special character
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/;
    return passwordRegex.test(password);
};
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Validation before submissio
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    
    if (!emailValid || !passwordValid) {
      setErrors({
        email: emailValid ? '' : 'Invalid email address',
        password: passwordValid ? '' : 'Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number'
      });
      return;
    }
    
    // Clear errors if validation passes
    setErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    // Call your login API
    dispatch(loginUser(formData, navigate));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 transition-all duration-500 hover:shadow-orange-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full opacity-60"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-red-50 rounded-full opacity-60"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#f5593d] to-[#e24023] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f5593d] to-[#e24023] mb-2">Login</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="group">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2 ml-1">
                Email Address
              </label>
              <div className="relative transition-all duration-300 rounded-lg group focus-within:ring focus-within:ring-[#f5593d]/20">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#f5593d]">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f5593d] focus:bg-white transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="group">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2 ml-1">
                Password
              </label>
              <div className="relative transition-all duration-300 rounded-lg group focus-within:ring focus-within:ring-[#f5593d]/20">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#f5593d]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f5593d] focus:bg-white transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#f5593d] transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>
              )}
            </div>
            
            {/* Forgot Password Link */}
            {/* <div className="text-right">
              <a href="/forgot-password" className="text-sm text-gray-600 hover:text-[#f5593d] transition-colors duration-300">
                Forgot password?
              </a>
            </div> */}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#f5593d] to-[#e24023] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mt-6 flex items-center justify-center"
            >
              <span>{isLoading ? 'Loging Account...' : 'Login'}</span>
            </button>
          </form>
          
          {/* Sign Up Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              {/* <a href="/signup" className="text-[#f5593d] hover:text-[#e24023] font-medium transition-colors duration-300">
                Sign up now
              </a> */}
              <Link to="/signUp" className="text-[#f5593d] hover:text-[#e24023] font-medium transition-colors duration-300">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;