import logo from '../assets/logo.svg';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 bg-bg-muted rounded-lg">
      <div className="flex items-center justify-center">
        <img src={logo} alt="Wiskeep" className="h-10 w-auto" />
      </div>
    </div>
  );
};

export default Home;
