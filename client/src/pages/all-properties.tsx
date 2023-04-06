import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import {
    Box,
    Stack,
    Typography,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { PropertyCard, CustomButton } from "components";
import { type } from "os";

const AllProperties = () => {
  const navigate = useNavigate();
  const{tableQueryResult:{data,isLoading,isError},
  current,
  setCurrent,
  setPageSize,
  pageCount,
  sorter, setSorter,
  filters, setFilters,
  } = useTable();

  console.log(data);
  const allProperties = data?.data ?? [];

  const currentPrice = sorter.find((item) => item.field === 'price')?.order;

  const currentFilterValues= useMemo(() =>{
    const logicalFilters = filters.flatMap((item: any) =>
    "field" in item ? item : [],);


    return{
      title: logicalFilters.find((item:any)=> item.field ==='title')?.value || '',
      propertyType:logicalFilters.find((item)=> item.field === 'propertyType')?.value || '',
    }
  }, [filters]);

  const toggleSort = (field:string) =>{
    setSorter([{field, order: currentPrice === 'asc' ? 'desc':'asc'}]);
  }

  if(isLoading) return <Typography>Chargement...</Typography>;
  if(isError) return <Typography>Erreur...</Typography>;
  return( 
    <Box>

        <Box mt="20px" sx= {{display:"flex", flexWrap:'wrap', gap:3}}>
            <Stack direction="column" width="100%">
              <Typography fontSize={25} fontWeight={700} color="#11142d">
                {!allProperties.length ? "Il n'y a pas de propriété":"Les propriétes"}
              </Typography>
              <Box mb={2} mt={3} display="flex" width="84%" justifyContent="space-between" flexWrap="wrap">
                  <Box display="flex" gap={2} flexWrap="wrap" mb={{xs:'20px',sm:0}}>
                      <CustomButton
                        title={`trié par pfrix ${currentPrice==='asc'? '↑':'↓'}`}
                        handleClick={()=>toggleSort('price')}
                        backgroundColor="#475be8"
                        color='#fcfcfc'
                      />
                      <TextField
                        variant='outlined'
                        color='info'
                        placeholder='recherche par titre'
                        value={currentFilterValues.title}
                        onChange={(e)=>{
                          setFilters([
                            {
                              field:"title",
                              operator:'contains',
                              value: e.currentTarget.value ? e.currentTarget.value: undefined
                            }
                          ])
                        }}

                      />
                      <Select
                        variant='outlined'
                        color='info'
                        displayEmpty
                        required
                        inputProps={{'aria-label':'Without label'}}
                        defaultValue=""
                        value={currentFilterValues.propertyType}
                        onChange={(e)=>{
                          setFilters([
                            {
                              field:"propertyType",
                              operator:'eq',
                              value: e.target.value
                            }
                          ], 'replace')
                        }}
                      >
                        <MenuItem value="" >tout</MenuItem>
                        {["Apartment","Villa","Farmhouse","Condos","Townhouse","Duplex","Studio", "Chalet",
                                ].map((type)=>(<MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>))}
                      </Select>
                  </Box>
              </Box>
            </Stack>
        </Box>



      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* <Typography fontSize={25} fontWeight={700} color="#11142d">
            Les propriétés
        </Typography> */}
        <CustomButton
          title= "Ajouter une propriété"
          handleClick={()=>navigate('/properties/create')}
          backgroundColor ="#475be8"
          color ="#fcfcfc"
          icon = {<Add/>}
        />
      </Stack>
      <Box mt="20px" sx={{display:'flex', flexWrap:'Wrap', gap:3}}>
          { allProperties.map((property:any)=>(
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location= {property.location}
              price={property.price}
              photo={property.photo}
            />
          ))}
      </Box>
      {allProperties.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
             title= "Precedente"
             handleClick = {() => setCurrent((prev: number)=>prev-1)} 
             backgroundColor ="#475be8"
             color ="#fcfcfc"
             disabled={!(current > 1 )}
          />
          <Box display={{xs:'hidden', sm:'flex'}} alignItems="center" gap="5px">
            Page{' '}<strong>{current} sur {pageCount}</strong>

          </Box>
          <CustomButton
             title= "Prochaine"
             handleClick = {() => setCurrent((prev: number)=>prev+1)} 
             backgroundColor ="#475be8"
             color ="#fcfcfc"
             disabled={current === pageCount }
          />
          <Select
            variant='outlined'
            color='info'
            displayEmpty
            required
            inputProps={{'aria-label':'Without label'}}
            defaultValue={10}
            onChange={(e)=>setPageSize(e.target.value ? Number(e.target.value):10)}
          > 
            {[10,20,30,40,50].map((size)=> <MenuItem key={size} value={size} >Vu {size}</MenuItem>)}
          </Select>
        </Box>
      )}
    </Box>
  );
}

export default AllProperties