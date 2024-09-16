import React from 'react';
import { Button } from 'antd';
import './style.css';

interface CustomButtonProps {
  color: string;
  title: string;
  
}

const CustomButton: React.FC<CustomButtonProps> = ({ color, title }) => {
  return (
    <Button className="customButton" style={{ backgroundColor: color, borderColor: color }}    htmlType="submit" >
      {title}
    </Button>
  );
};

export default CustomButton;