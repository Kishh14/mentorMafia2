import { FaYoutube } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";
import { FaTwitter } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-36 pt-20 pb-10">
      <div className="sec-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CiFaceSmile className="text-6xl pb-1" />
          <p>Break down geographical and time zone barriers. Our platform connects <br /> you with mentors from across the globe, offering the flexibility to <br /> learn on your schedule. </p>
        </div>
        <div className="socials flex items-center gap-3">
          <Link to={'/'} className="text-2xl bg-black text-white rounded-full p-2">
            <FaYoutube />
          </Link>
          <Link to={'/'} className="text-2xl bg-black text-white rounded-full p-2">
            <ImLinkedin />
          </Link>
          <Link to={'/'} className="text-2xl bg-black text-white rounded-full p-2">
            <FaTwitter />
          </Link>
        </div>
      </div>
      <div className="sec-2 flex items-center justify-between py-12">
        <div className="flex gap-8 ps-2">
          <Link to={'/mentors'}>find mentors</Link>
          <Link to={'/signup'}>become a mentor</Link>
          <Link to={'/'}>community</Link>
        </div>
        <div className="flex gap-8">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer;