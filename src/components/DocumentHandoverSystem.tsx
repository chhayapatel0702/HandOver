
import React, { useEffect, useState } from 'react';
import Header from './Header';
import TabNavigation from './TabNavigation';
import DocumentCard from './DocumentCard';
import Pagination from './Pagination';
import Select from './Select';
import Button from './Button';
import Banner from './Banner';
import axios from 'axios';
import API_CONFIG from '../api/config';
import { useToast } from "@/components/ui/use-toast";
import Popup from "./Popup";
 

const DocumentHandoverSystem: React.FC = () => {


  const [activeTab, setActiveTab] = useState('available');
  const [currentPage, setCurrentPage] = useState(1);
  const [mockDocuments, setMockDocuments] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [documentTypes,setDocumentTypes]=useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userOptions,setuserOptions]=useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [popupOpen, setPopupOpen] = useState(false);
  const [message,setMessage]=useState('');

  
  // Items per page calculation - 4 cards per row, 2 rows
  const itemsPerPage = 8;

  //Documentdropdown
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        DropDownType: "MASTER",
        Type: "DocFunctionalType",
        FilterByKey: 1,
        FilterById: null,
        IncludeAll: true,
        LocaleCode: null
      }),
      primaryKeyId: 0,
      tableName: null,
      indexPage: '0',
      operationType: '',
      initiatedByUserOid: 'A0759F78-0C86-488E-AB8C-7E54D4C098A6',
      ApiToCall: 'DropDownMaster'
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setDocumentTypes(response.data);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
  }, [])
  const documentTypeOptions = documentTypes.map(doc => doc.TableName);
  const handleChange = (selectedTableName) => {
    const selectedDoc = documentTypes.find(doc => doc.TableName === selectedTableName);
    setSelectedDocumentType(selectedDoc);
    setSelectedDocId(selectedDoc?.TableDefId); 
  };

  
  //userOptionsdropdown
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        DropDownType: "MASTER",
        Type: "User", 
        FilterByKey: 1,
        FilterById: null,
        IncludeAll: true,
        LocaleCode: null
      }),
      primaryKeyId: 0,
      tableName: null,
      indexPage: '0',
      operationType: '',
      initiatedByUserOid: 'A0759F78-0C86-488E-AB8C-7E54D4C098A6',
      ApiToCall: 'DropDownMaster'
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setuserOptions(response.data); 
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
  }, [selectedDocumentType])
  const userOptionsTypeOptions = userOptions.map(doc => doc.UserName);
  const handleChangeUser = (selectedUserName) => {
    const selectedUser = userOptions.find(doc => doc.UserName === selectedUserName);
    setSelectedUser(selectedUser);
    setSelectedUserId(selectedUser?.Oid); 
   // console.log(selectedUser);
  };
 // console.log(selectedUserId);


  //SEL
  useEffect(() => {
    const curdInput = {
      inputJson: `{"TableDefId":${selectedDocId},"ProcessStatusKey":"HND","ReadyToHandover":true}`,
      primaryKeyId: 0,
      tableName: 'BatchGeneration',
      indexPage: '0',
      operationType: 'SEL',
      initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
      ApiToCall: 'CRUD',
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);      
        if (Array.isArray(response.data)) {
          setMockDocuments(response.data);
        } else {         
          setMockDocuments([]);
          toast({
            title: "Data Error",
            description: "Received invalid data format from server",
            variant: "destructive"
          });
          console.error("API Response is not an array:", response.data);
        }
      } catch (err) {
        setMockDocuments([]); 
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive"
        });
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }; 
    fetchData();
  }, [selectedDocId,toast]);

  // Calculate pagination
  const totalItems = Array.isArray(mockDocuments) ? mockDocuments.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Get current page items
  const getCurrentPageItems = () => {
    if (!Array.isArray(mockDocuments)) return [];   
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockDocuments.slice(startIndex, endIndex);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  //INS
  const onBulkHandOverClick=()=>{
    let curdInput:any;
    if(selectedUserId!=null){
      console.log("User....");
      curdInput = {
        inputJson: `{"HandoverGivenToUser":${selectedUserId},"InputList":[{
                         }]}`,
        primaryKeyId: 0,
        tableName: 'BatchHandover',
        indexPage: '0',
        operationType: 'INS',
        initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
        ApiToCall: 'CRUD',
      };
   }
   else{
    console.log("Not User....");
      curdInput = {
      inputJson: `{}`,
      primaryKeyId: 0,
      tableName: 'BatchHandover',
      indexPage: '0',
      operationType: 'INS',
      initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
      ApiToCall: 'CRUD',
    };
   }
    console.log(mockDocuments);
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-2 flex-1 overflow-auto">
        <Banner title="Batch Handover" className="mt-1" />
        
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Select Document Type</span>
            <div className="w-48">
              <Select  options={documentTypeOptions} placeholder="Select Document Type" onChange={handleChange} />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading documents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {getCurrentPageItems().length > 0 ? (
              getCurrentPageItems().map((doc) => (
                <DocumentCard
                  key={doc.BatchGenerationId}
                  id={doc.BatchCode || 'N/A'}
                  date={doc.BatchGenerationDate || 'N/A'}
                  name={doc.BatchRemark || 'N/A'}
                  source={doc.TableName || 'N/A'}
                  count={doc.TotalRecords || 0}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No documents available</p>
              </div>
            )}
          </div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages > 0 ? totalPages : 1}
          onPageChange={onPageChange}
        />
        
        <div className="mt-3 mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm">HandOver Given To User:</span>
            <div className="w-48">
              <Select 
                options={userOptionsTypeOptions} 
                placeholder="Select User"
                onChange={handleChangeUser}
              />
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onBulkHandOverClick}
          >
            Bulk HandOver
          </Button>
        </div>
      </main>
      <Popup
        message={message}
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
};

export default DocumentHandoverSystem;
