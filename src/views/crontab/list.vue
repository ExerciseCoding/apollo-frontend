<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="任务名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!--      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加任务
      </el-button>
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" min-width="10px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="Date" width="150px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="shell命令" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.command }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表达式" width="95" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cronExpr }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="cron表达式" align="center" width="95">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--          <span v-else>0</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleJobKill(row)">
            强杀
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <!--          <el-button size="mini" @click="handleModifyStatus(row,'draft')">-->
          <!--            日志-->
          <!--          </el-button>-->
          <!--          <el-popover-->
          <!--            placement="right"-->
          <!--            :width="400"-->
          <!--            trigger="click"-->
          <!--          >-->
          <!--            <template #reference>-->
          <!--              <el-button id= "log" size="mini" type="info"> 日志记录 </el-button>-->
          <!--            </template>-->
          <!--            <el-table :data="gridData">-->
          <!--              <el-table-column width="150" property="date" label="日期"></el-table-column>-->
          <!--              <el-table-column width="100" property="name" label="姓名"></el-table-column>-->
          <!--              <el-table-column width="300" property="address" label="地址"></el-table-column>-->
          <!--            </el-table>-->
          <!--          </el-popover>-->
          <el-popover
            placement="right"
            width="920"
            trigger="click"
          >
            <el-table :data="logData">
              <!--              <el-table-column width="100" property="jobName" label="命令"></el-table-column>-->
              <el-table-column width="100" property="command" label="命令" />
              <el-table-column width="100" property="err" label="错误输出" />
              <el-table-column width="100" property="output" label="脚本输出" />
              <el-table-column width="155" property="planTime" label="计划开始时间" />
              <el-table-column width="155" property="scheduleTime" label="实际调度时间" />
              <el-table-column width="155" property="startTime" label="开始执行时间" />
              <el-table-column width="155" property="endTime" label="执行结束时间" />
            </el-table>
            <el-button id="log" slot="reference" size="mini" type="info" @click="getLog(row)">执行日志</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!--        <el-form-item label="Type" prop="type">-->
        <!--          <el-select v-model="temp.name" class="filter-item" placeholder="Please select">-->
        <!--            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="Date" prop="timestamp">-->
        <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--        </el-form-item>-->
        <el-form-item v-if="textMap[dialogStatus] === '创建任务'" label="任务名称" prop="name">
          <el-input v-model="temp.name" :disabled="false" />
        </el-form-item>
        <el-form-item v-if="textMap[dialogStatus] === '编辑任务'" label="任务名称" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="命令">
          <el-input v-model="temp.command" />
        </el-form-item>
        <el-form-item label="表达式">
          <el-input v-model="temp.cronExpr" placeholder="* * * * * * *" />
          <el-alert
            title="*(秒) *(分) *(时) *(日) *(月) *(周) *(年)"
            type="info"
            show-icon
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { ListJob, CreateJob, JobDelete, JobKill, JobLog } from '@/api/crontab'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CrontabList',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // page: 1,
        // limit: 20,
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        command: '',
        cronExpr: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑任务',
        create: '创建任务'
      },
      dialogPvVisible: false,
      pvData: [],
      logData: []
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      ListJob(this.listQuery).then(response => {
        this.list = response.data
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      // this.listQuery.page = 1
      this.getList()
    },
    handleJobKill(row) {
      this.$confirm('确定强制停止该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const killQuery = {
          'name': row.name
        }
        JobKill(killQuery).then(response => {
          this.$notify({
            title: 'Success',
            message: '强杀任务成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          title: 'Success',
          message: '已取消强杀',
          type: 'name',
          duration: 2000
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        command: '',
        cronExpr: ''
      }
    },
    resetLogData() {
      this.logData = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.name
          CreateJob(this.temp).then(() => {
            console.log(this.temp)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.name
          CreateJob(this.temp).then(() => {
            console.log(this.temp)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteQuery = {
          'name': row.name
        }
        JobDelete(deleteQuery).then(response => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          title: 'Success',
          message: '已取消删除',
          type: 'name',
          duration: 2000
        })
      })
    },
    getLog(row) {
      this.resetLogData()
      const logQuery = {
        'name': row.name,
        'skip': 0,
        'limit': 6
      }
      JobLog(logQuery).then(response => {
        this.logData = response.data

        for (var i = 0; i < this.logData.length; ++i) {
          this.logData[i].planTime = this.timeFormat(this.logData[i].planTime)
          this.logData[i].scheduleTime = this.timeFormat(this.logData[i].scheduleTime)
          this.logData[i].startTime = this.timeFormat(this.logData[i].startTime)
          this.logData[i].endTime = this.timeFormat(this.logData[i].endTime)
        }
      })
    },
    timeFormat(millsecond) {
      // 前缀补0: 2018-08-07 08:01:03.345
      function paddingNum(num, n) {
        var len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      }
      var date = new Date(millsecond)
      var year = date.getFullYear()
      var month = paddingNum(date.getMonth() + 1, 2)
      var day = paddingNum(date.getDate(), 2)
      var hour = paddingNum(date.getHours(), 2)
      var minute = paddingNum(date.getMinutes(), 2)
      var second = paddingNum(date.getSeconds(), 2)
      // var millsecond = paddingNum(date.getMilliseconds(), 3)
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  }
}
</script>
<style lang="scss" scoped>
  #log {
    margin-left: 10px;
  }
</style>
