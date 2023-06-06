import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import OrderIcon from "../assets/icons/OrderIcon";
import ShipmentIcon from "../assets/icons/ShipmentIcon";
import CustomerIcon from "../assets/icons/CustomerIcon";
import EquipmentIcon from "../assets/icons/EquipmentIcon";
import CommodityIcon from "../assets/icons/CommodityIcon";
import InviteIcon from "../assets/icons/InviteIcon";
import SettingIcon from "../assets/icons/SettingIcon";
import arrowdown from "../assets/arrowdown.png";
import invoiceicon from "../assets/invoiceicon.svg";
import companyicon from "../assets/companyicon.svg";
import { NavLink, useLocation, Link } from "react-router-dom";
function Navbar() {
  const location = useLocation();
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


  useEffect(() => {
    if (location.pathname.startsWith("/maintenancelisting")) {
      setIsEquipmentOpen(true);
    } else {
      setIsEquipmentOpen(false);
    }
  }, [location]);

  return (
    <nav>
      <Link to="/">
      <img src={logo} alt="logo" />
      </Link>
      <div className="mt-24">
      <NavLink
          to="/order"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option" : ""}`
          }
        >
          <OrderIcon  id="nav_icon" />

          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Order
          </span>
        </NavLink>
        <NavLink
          to="/shipment"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option" : ""}`
          }
        >
          <ShipmentIcon  id="nav_icon" />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Shipment
          </span>
        </NavLink>
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option" : ""}`
          }
        >
          <CustomerIcon  id="nav_icon" />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Customer
          </span>
        </NavLink>
        {/* <NavLink
          to="/equipment"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option" : ""}`
          }
        >
          <EquipmentIcon  id="nav_icon" />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Equipment
          </span>
        </NavLink> */}
          <div>
          <div className="flex mb-4 py-3 nav-opt">
            <EquipmentIcon id="nav_icon" />
            <NavLink to="/equipment" className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link" activeClassName="selected-option">
              Equipment
            </NavLink>
            <div className="ml-auto">
              <img src={arrowdown} className="ml-auto cursor-pointer" alt="Arrow Down Icon" onClick={() => setIsEquipmentOpen(!isEquipmentOpen)} />
            </div>
          </div>
          {isEquipmentOpen && (
            <div>
              <ul>
                <div className="flex mb-2 px-10 py-2 cursor-pointer nav-opt">
                  <Link to="/maintenancelisting" className="cursor-pointer font-medium text-NavBarText custom-link">
                    Maintenance
                  </Link>
                  <img src={invoiceicon} className="ml-auto" />
                </div>
              </ul>
            </div>
          )}
        </div>
        <NavLink
          to="/driver"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option" : ""}`
          }
        >
          <EquipmentIcon  id="nav_icon" />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Driver
          </span>
        </NavLink>
        
        <NavLink
          to="/commodity"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt  ${isActive ? "selected-option" : ""}`
          }
        >
          <CommodityIcon id="nav_icon" 
          className={({ isActive }) => (isActive ? "icon-option" : "")}
        
        />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
            Commodity
          </span>
        </NavLink>
        <NavLink
          to="/invite"
          className={({ isActive }) =>
            `flex mb-2 py-3 nav-opt ${isActive ? "selected-option " : ""}`
          }
        >
          <InviteIcon  id="nav_icon" />
          <span className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link">
          Invite Team
          </span>
        </NavLink>
      
      
        <div>
          <div className="flex mb-4 py-3 nav-opt">
            <SettingIcon id="nav_icon" />
            <NavLink to="/settings" className="font-medium text-2xl text-NavBarText pl-2 leading-6 custom-link" activeClassName="selected-option">
              Settings
            </NavLink>
            <div className="ml-auto">
              <img src={arrowdown} className="ml-auto cursor-pointer" alt="Arrow Down Icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)} />
            </div>
          </div>
          {isSettingsOpen && (
            <div>
              <ul>
                <div className="flex mb-2 px-10 py-2 cursor-pointer nav-opt">
                  <li className="cursor-pointer font-medium text-NavBarText custom-link">
                    Invoice
                  </li>
                  <img src={invoiceicon} className="ml-auto" />
                </div>
                <div className="flex px-10 cursor-pointer py-2 nav-opt">
                  <li className="cursor-pointer font-medium text-NavBarText custom-link">
                    Company Information
                  </li>
                  <img src={companyicon} className="ml-auto" />
                </div>
              </ul>
            </div>
          )}
        </div>
    </div>
  </nav>
);
}
export default Navbar;
