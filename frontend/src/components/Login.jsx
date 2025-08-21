import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
    const {user} = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  if (user) {
    return <Navigate to='/' replace />;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKENDURL}/user/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
      localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/');
        toast.success(response.data.message);
        setFormData({
          email: '',
          password: '',
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center w-screen h-screen text-white'>
      <form
        onSubmit={handleSubmit}
        className='p-6 space-y-4 border shadow-md rounded-xl'
      >
        <div className='my-4'>
          <h1 className='text-xl font-bold text-center'>Logo</h1>
          <p>Login to see photos and videos from your friends.</p>
        </div>

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            className='mt-2 text-black focus-visible:ring-transparent'
            placeholder='you@example.com'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            className='mt-2 text-black focus-visible:ring-transparent'
            placeholder='********'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {loading ? (
          <Button type='submit' className='w-full hover:bg-gray-400'>
            Please wait...
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          </Button>
        ) : (
          <Button
            type='submit'
            className='w-full text-lg font-bold text-black bg-white hover:bg-gray-400 hover:text-white '
          >
            Login
          </Button>
        )}

        <p className='mt-3 text-center'>
          {' '}
          dont have an account?{' '}
          <Link className='text-blue-600' to='/signup'>
            Sign up
          </Link>{' '}
        </p>
      </form>
    </div>
  );
};

export default Login;
