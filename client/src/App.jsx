import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("LOST");
  const [file, setFile] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("LATEST");

  const [editId, setEditId] = useState(null);

  // GET ITEMS
  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/items");
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("type", type);
    if (file) formData.append("image", file);

    if (editId) {
      await axios.put(`http://localhost:5000/items/${editId}`, formData);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/items", formData);
    }

    setName("");
    setLocation("");
    setFile(null);
    fetchItems();
  };

  // DELETE
  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/items/${id}`);
    fetchItems();
  };

  // EDIT
  const handleEdit = (item) => {
    setName(item.name);
    setLocation(item.location);
    setType(item.type);
    setEditId(item._id);
  };

  // FILTER + SEARCH + SORT
  let filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filter !== "ALL") {
    filtered = filtered.filter((item) => item.type === filter);
  }

  filtered.sort((a, b) =>
    sort === "LATEST"
      ? new Date(b.time) - new Date(a.time)
      : new Date(a.time) - new Date(b.time)
  );

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Lost & Found Portal</h1>

      {/* TYPE BUTTONS */}
      <button
        onClick={() => setType("LOST")}
        style={{
          background: type === "LOST" ? "red" : "#ccc",
          color: "white",
          padding: "10px",
          margin: "5px",
          borderRadius: "5px",
        }}
      >
        Report Lost
      </button>

      <button
        onClick={() => setType("FOUND")}
        style={{
          background: type === "FOUND" ? "green" : "#ccc",
          color: "white",
          padding: "10px",
          margin: "5px",
          borderRadius: "5px",
        }}
      >
        Report Found
      </button>

      <br /><br />

      {/* FORM */}
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", margin: "5px" }}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: "8px", margin: "5px" }}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleSubmit} style={{ margin: "5px", padding: "8px" }}>
        {editId ? "Update" : "Submit"}
      </button>

      <button
        onClick={() => {
          setName("");
          setLocation("");
          setEditId(null);
        }}
        style={{ margin: "5px", padding: "8px" }}
      >
        Clear
      </button>

      <br /><br />

      {/* SEARCH */}
      <input
        placeholder="Search item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "200px" }}
      />

      <br /><br />

      {/* SORT */}
      <button
        onClick={() =>
          setSort(sort === "LATEST" ? "OLDEST" : "LATEST")
        }
        style={{ padding: "8px", margin: "5px" }}
      >
        Sort: {sort === "LATEST" ? "Latest First" : "Oldest First"}
      </button>

      <br /><br />

      {/* FILTER */}
      <button onClick={() => setFilter("ALL")} style={{ margin: "5px" }}>
        All
      </button>
      <button onClick={() => setFilter("LOST")} style={{ margin: "5px" }}>
        Lost
      </button>
      <button onClick={() => setFilter("FOUND")} style={{ margin: "5px" }}>
        Found
      </button>

      <h2>Items</h2>

      {/* ITEMS */}
      {filtered.map((item) => (
        <div
          key={item._id}
          style={{
            background: "#1e293b",
            color: "white",
            padding: "15px",
            margin: "15px auto",
            width: "300px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <h3 style={{ color: item.type === "LOST" ? "red" : "lime" }}>
            {item.type}
          </h3>

          <p>
            {item.name} ({item.location})
          </p>

          {item.image && (
            <img
              src={`http://localhost:5000/${item.image}`}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          )}

          <small>{item.time}</small>

          <br /><br />

          <button
            onClick={() => handleEdit(item)}
            style={{ margin: "5px", padding: "5px" }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteItem(item._id)}
            style={{ margin: "5px", padding: "5px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;