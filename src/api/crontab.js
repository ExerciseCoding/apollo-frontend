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
