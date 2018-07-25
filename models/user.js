module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
     username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[a-z0-9\_\-]+$/i,
          }
     },
    email: {
        type: DataTypes.STRING,
         validate: {
         isEmail: true
        }
     },
    fbid: DataTypes.STRING,
    githubid: DataTypes.STRING,
    password:DataTypes.STRING,
    miles_driven: DataTypes.FLOAT(1),
    mpg: DataTypes.INTEGER,
    maintenance: DataTypes.BOOLEAN,
    zip: DataType.INTEGER(5),
    electric_bill: DataTypes.FLOAT(2),
    natgas_bill: DataTypes.FLOAT(2),
    household_members: DataTypes.INTEGER,
    aluminum: DataTypes.BOOLEAN,
    plastic: DataTypes.BOOLEAN,
    glass: DataTypes.BOOLEAN,
    paper: DataTypes.BOOLEAN

  }, {});
  return user;
};