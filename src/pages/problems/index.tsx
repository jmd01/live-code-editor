// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import ProblemsTable from "../../views/problems/ProblemsTable";


const Problems = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Problems
        </Typography>
        <Typography variant='body2'>Choose a problem to get started</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Easy' titleTypographyProps={{ variant: 'h6' }} />
          <ProblemsTable />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Medium' titleTypographyProps={{ variant: 'h6' }} />
          <ProblemsTable />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Hard' titleTypographyProps={{ variant: 'h6' }} />
          <ProblemsTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Problems
