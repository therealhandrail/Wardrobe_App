import { useParams } from "react-router-dom";

function MyOutfitDetails() {
  const { id } = useParams();

  return (
    <div className="MyOutfitDetails">
      <h1>Outfit Details for ID: {id}</h1>
      {/* Add logic to fetch and display outfit details based on the ID */}
    </div>
  );
}

export default MyOutfitDetails;
