import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import {
  Modal,
  ModalHeader,
  ModalBody,
  
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenu,
  clearMenuState,
  deleteMenu,
  fetchMenuById,
  setPageSize,
  setCurrentPage,
} from "@/slices/MenuSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { usePermissions } from "@/context/PermissionsContext";

const MenuList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { menuList, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.menu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [menuForm, setMenuForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  
  const { hasPermission } = usePermissions();
  
  const [isLoading, setIsLoading] = useState(false); // Start as true since we're fetching data
  const menuColumns = [
     { name: "Id", selector: (row) => row.id, sortable: true },
     {
       name: "Integration Id",
       selector: (row) => row.integrationId,
       sortable: true,
     },
     { name: "Name", selector: (row) => row.nameEn, sortable: true },
     {
       name: "Name AR",
       selector: (row) => row.nameAr,
       sortable: true,
     },
     {
       name: "Price",
       selector: (row) => row.price,
       sortable: true,
     },
     {
       name: "Description",
       selector: (row) => row.descriptionEn,
       sortable: true,
     },
    {
   name: "Action",
   cell: (row) => {
    return(
<div className="flex gap-2 w-full">
         <button
           title="Edit Menu"
           className="uniform_icon_btn"
           // onClick={() => handleDetailClick(row.menuId)}
         >
           <HiPencilAlt style={{ fontSize: "15px" }} />
         </button>
         {hasPermission("Menus", "delete") && (
           <button
             title="Delete Menu"
             className="uniform_icon_btn"
             // onClick={() => handleDeleteClick(row.menuId)}
           >
             <HiTrash style={{ fontSize: "15px" }} />
           </button>
         )}
       </div>
    )
       
   },
       style: {
         textAlign: "right", // Align the entire column content to the center
       },
     },
   ];

  const handleDetailClick = async (menuId) => {
    try {
      const response = await dispatch(fetchMenuById({ menuId })).unwrap();
      if (response) {
        setMenuForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({
          title: "Error",
          text: "Failed to fetch details",
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to fetch menu details: " + error.message);
    }
  };
  const handleCancel = () => {
    setCreateModalOpen(false);
  };
  // const handleDeleteClick = (menuId) => {
  //   SweetAlert.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         dispatch(deleteMenu({ menuId })).then(() => {
  //           showSweetAlert({
  //             title: "Deleted Successfully",
  //             text: "",
  //             icon: "success",
  //           });
  //           refreshMenuList();
  //         });
  //       } catch (error) {
  //         alert("An unexpected error occurred: " + error.message);
  //       }
  //     }
  //   });
  // };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchMenu({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: page,
      })
    );
  };

  useEffect(() => {
    
    if(menuList){
      console.log(menuList)
    }
  }, [menuList])

  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(
      fetchMenu({
        clientId: localStorage.getItem("clientId"),
        pageSize: newSize,
        pageNo: 1,
        SearchStr: filterText,
      })
    );
  };

  // const handleFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setMenuForm({ ...menuForm, [name]: value });
  // };
  // const toggleModal = () => {
  //   setIsModalOpen(false);
  // };

  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setFilterText(searchValue);
    setter(e);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchMenu({
          clientId: localStorage.getItem("clientId"),
          pageSize,
          pageNo: currentPage,
          SearchStr: searchValue,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  // const handleUpdateSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
    
  //   try {
  //     const requestBody = {
  //       menuId: menuForm.menuId || 0,
  //       menuName: menuForm.menuName || "string",
  //       actionBy: localStorage.getItem("userId"),
  //       clientId: menuForm.clientId || 0,
  //     };

  //     const response = await dispatch(updateMenu(requestBody)).unwrap();
  //     if (response.success) {
  //       showSweetAlert({
  //         title: "Updated Successfully",
  //         text: "",
  //         icon: "success",
  //       });
  //       setIsLoading(false);
  //       setIsModalOpen(false);
  //       refreshMenuList();
  //     } else {
  //       showSweetAlert({
  //         title: "Error",
  //         text: response.message,
  //         icon: "error",
  //       });
  //     }
  //   } catch (error) {
  //     alert("Failed to update menu: " + error.message);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const refreshMenuList = () => {
    dispatch(
      fetchMenu({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchMenu({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
    return () => {
      dispatch(clearMenuState());
    };
  }, [dispatch]);

  // const handleCreate = () => {
  //   setCreateModalOpen(true);
  // };

  const filteredMenu = menuList.filter(
    (menu) =>
      menu.menuName &&
      menu.menuName.toLowerCase().includes(filterText.toLowerCase())
  );
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <SearchBar
              label="Search"
              value={filterText}
              onChange={handleSearchString(setFilterText)}
            />
          </div>
        </div>
      </div>
    );
  }, [filterText]);

 

  return (
    <App>
      <div className="flex items-center">
        {(loading || isLoading) && <Loading />}
        <div className="">
          <h4 className="font-bold">Menu List </h4>
        </div>
       
      </div>
      <div className="overflow-auto">
        <DataTable
          data={menuList}
          columns={menuColumns}
          highlightOnHover
          striped
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          sortIcon
          sortServer
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
        />
      </div>

      {/* {isModalOpen && (
        <MenuSelection
        isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshMenuList} 
          />
      )} */}
    </App>
  );
};

export default MenuList;
