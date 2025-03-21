export default function Dashboard() {
  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <p>Welcome to your clean and modern admin panel!</p>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-4">123</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Active Sessions</h5>
              <p className="card-text display-4">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
