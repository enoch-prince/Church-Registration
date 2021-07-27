import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Dashbaord = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="container">
      <h2>Akwaaba {user ? user.firstName : ""} 🤝 - Dashboard</h2>
    </div>
  );
};

export default Dashbaord;
