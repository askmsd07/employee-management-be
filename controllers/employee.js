const db = require('../db/connection');

const addEmployee = async (req, res, next) => {
  const {
    employeeId,
    employeeName,
    age,
    address,
    mobile
  } = req.body;

  if (employeeId) {
    const employees = await getEmployeesById(employeeId);
    const isExistingEmployee = employees.length > 0;
    if (!isExistingEmployee) {
      const addEmployeeResponse = await createEmployee(employeeId, employeeName, age, address, mobile);
      res.status(200).send({
        message: 'Employee added successfully'
      })
    } else {
      res.status(409).send({
        message: 'Employee already exist'
      })
    }
  } else {
    res.status(500).send({
      message: 'Employee Id is required'
    })
  }
}

const getEmployeeList = async(req, res, next) => {
  let employeeList = await getAllEmployees();
  res.status(200).send({
    message: 'Success',
    data: employeeList
  })
};

const deleteEmployee = async(req, res, next) => {
  let empId = req.params.id;
  await deleteEmployeeById(empId);

  res.status(200).send({
    message: 'Employee deleted successfully'
  })
}


//Helpers
const getEmployeesById = (id) => {
  return new Promise((resolve, reject) => {
    let query = `select * from employees where employee_id='${id}'`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result);
    })
  })
}

const getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from employees`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result);
    })
  })
}

const createEmployee = async (id, name, age, address, mobile) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO employees (employee_id, employee_name, age, address, mobile) VALUES('${id}', '${name}', '${age}', '${address}', '${mobile}')`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  })
}

const deleteEmployeeById = async (id) => {
  return new Promise((resolve, reject) => {
    let query = `DELETE FROM employees where employee_id='${id}'`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  })
}

module.exports = {
  addEmployee,
  getEmployeeList,
  deleteEmployee
};
