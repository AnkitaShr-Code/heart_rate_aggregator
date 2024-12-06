module.exports = (sequelize, DataTypes) => {
  const HeartRate = sequelize.define('HeartRate', {
    on_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    measurement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.STRING,
      allowNull: true 
    }
  });

  return HeartRate;
};
