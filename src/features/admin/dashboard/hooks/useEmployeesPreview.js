import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminUsersService";

function useEmployeesPreview() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getUsers()
      .then((data) => {
        const list = data?.users || data || [];
        setEmployees(list.filter((user) => user.role === "employee" && user.is_active));
      })
      .catch(() => setEmployees([]));
  }, []);

  return employees;
}

export default useEmployeesPreview;