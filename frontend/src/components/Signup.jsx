import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (user) {
    // if logged in, instantly redirect without rendering anything
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
        `${BACKENDURL}/user/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate('/login');

        toast.success(response.data.message);
        setFormData({
          username: '',
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
    <div className='flex items-center justify-center w-screen h-screen'>
      <form
        onSubmit={handleSubmit}
        className='p-6 space-y-4 border shadow-md rounded-xl'
      >
        <div className='my-4'>
          <h1 className='text-xl font-bold text-center'>Logo</h1>
          <p>Sign up to see photos and videos from your friends.</p>
        </div>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='username'
            name='username'
            type='text'
            className='mt-2 focus-visible:ring-transparent'
            placeholder='Your name'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            className='mt-2 focus-visible:ring-transparent'
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
            className='mt-2 focus-visible:ring-transparent'
            placeholder='********'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {loading ? (
          <Button type='submit' className='w-full'>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          </Button>
        ) : (
          <Button type='submit' className='w-full'>
            Sign Up
          </Button>
        )}

        <p className='mt-3 text-center'>
          already have an account?{' '}
          <Link className='text-blue-600' to='/login'>
            Login
          </Link>{' '}
        </p>
      </form>
    </div>
  );
};

export default Signup;
