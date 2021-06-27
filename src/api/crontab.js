import request from '@/utils/request'

export function ListJob(data) {
  return request({
    url: '/cron/job/list',
    method: 'post',
    data
  })
}

export function CreateJob(data) {
  return request({
    url: '/cron/job/save',
    method: 'post',
    data
  })
}

export function JobDelete(data) {
  return request({
    url: '/cron/job/delete',
    method: 'post',
    data
  })
}

export function JobKill(data) {
  return request({
    url: '/cron/job/kill',
    method: 'post',
    data
  })
}

export function JobLog(logQuery) {
  return request({
    url: '/job/log',
    method: 'get',
    params: logQuery
  })
}
