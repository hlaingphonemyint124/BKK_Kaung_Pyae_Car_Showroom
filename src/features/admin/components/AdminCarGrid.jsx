import AddCarCard from "./AddCarCard";
import AdminCarCard from "./AdminCarCard";

function AdminCarGrid({ cars, onAddClick, onCardClick }) {
  return (
    <div className="admin-grid">
      <AddCarCard onClick={onAddClick} />
      {cars.map((car) => (
        <AdminCarCard key={car.id} car={car} onClick={onCardClick} />
      ))}
    </div>
  );
}

export default AdminCarGrid;