import MainLayout from "../layouts/MainLayout";

type HomeProps = {
  toggleTheme: () => void;
};

const Home: React.FC<HomeProps> = ({ toggleTheme }) => {
  return <MainLayout toggleTheme={toggleTheme}/>;
};

export default Home;
