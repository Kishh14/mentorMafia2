import { account } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'next/image';
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";


export default function Header({ isLoggedIn, setIsLoggedIn, profilePicture, userName, profilePictureExist }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const session = account.get();
      session.then(
        function (repo) {
          setIsLoggedIn(true);
        }, function (err) {
          setIsLoggedIn(false);
        }
      )
    } catch (error) {
      setIsLoggedIn(false)
      console.error("Error checking session:", error);
    }
  }, [isLoggedIn])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <header className="py-2 px-10">
      <nav className="flex justify-between items-center">
        <Link to={'/'} className="logo">
          <Image src="/assets/logo/without-bg.png" alt='Logo' width={110} height={50} />
        </Link>
        <button className="menu-icon md:hidden" onClick={toggleSidebar}>
          <CiMenuFries className='text-2xl' />
        </button>
        <div className="nav-links hidden md:flex items-center gap-8">
          <Link to={'/'} className="text-sm text-gray-400">Home</Link>
          <Link to={'/mentors'} className="text-sm text-gray-400">Meet Our Mentors</Link>
          <Link to={'/signup'} className="text-sm text-gray-400">Become a Mentor</Link>
        </div>
        {isLoggedIn ?
          <Link to={'/account'} className='hidden md:flex items-center gap-2 bg-white bg-opacity-20 shadow-lg rounded-sm px-4 py-2'>
            <img className="rounded-full w-8 h-8" src={profilePictureExist ? profilePicture : "https://via.placeholder.com/80x80"} alt="" />
            <span>{userName}</span>
          </Link> :
          <div className="buttons-container hidden md:flex items-center gap-3">
            <Link to={'/login'} className="text-base py-3">Login</Link>
            <Link to={'/signup'} className="bg-blue-700 text-white rounded py-2 px-7">Sign Up</Link>
          </div>}
      </nav>

      <aside className={`md:hidden fixed top-0 left-0 w-3/5 h-full bg-gray-700 z-50 transition duration-300 ease-in-out transform ${isSidebarOpen ? '-translate-x-0' : '-translate-x-full'} md:static md:w-auto md:translate-x-0`}>
        <nav className="block relative px-4 py-6">
          <button className="menu-icon-close my-3 absolute" onClick={toggleSidebar}>
            <IoMdClose className='text-2xl' />
          </button>
          <Link to={'/'} className="text-md mb-4 mt-16 block">Home</Link>
          <Link to={'/mentors'} className="text-md mb-4 block">Meet Our Mentors</Link>
          <Link to={'/signup'} className="text-md mb-4 block">Become a Mentor</Link>
          {isLoggedIn ?
            <Link to={'/account'} className='flex items-center w-5/5 gap-2 bg-white bg-opacity-20 shadow-lg rounded-sm px-4 py-2'>
              <img className="rounded-full w-8 h-8" src={profilePictureExist ? profilePicture : "https://via.placeholder.com/80x80"} alt="" />
              <span>{userName}</span>
            </Link> :
            <div className="buttons-container flex items-center gap-3">
              <Link to={'/login'} className="text-base py-3 w-5/5">Login</Link>
              <Link to={'/signup'} className="bg-blue-700 w-5/5 text-white rounded py-2 px-4">Sign Up</Link>
            </div>}
        </nav>
      </aside>
    </header>
  );
}
