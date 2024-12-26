import SweetAlert from "sweetalert2";

const showSweetAlert = ({ title, text, icon, footer }) => {
  SweetAlert.fire({
    icon: icon || "error",  // Default to "error" if no icon is provided
    title: title || "Oops!",  // Default title
    text: text ,
    footer: footer || ''  // Default footer
  });
};

export default showSweetAlert;
