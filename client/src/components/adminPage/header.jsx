import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();

  const onLogoutClick = () => {
    dispatch(logoutUser());
  };

  const openMenu = () => setOpen(true);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={openMenu} className="lg:hidden sm:block bg-transparent text-rose-800 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
        <AlignJustify />
        <span className="sr-only">Menu</span>
      </Button>

      <div className="flex flex-1 justify-end">
        <Button
          onClick={onLogoutClick}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium bg-rose-800 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
