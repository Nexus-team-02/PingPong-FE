import { useState } from 'react'
import { getGithubBranchs, updateGithubConfig } from '@/api/github'
import useApi from '@/hook/useApi'
import Modal from '@/components/common/Modal'

interface Branch {
  name: string
  sha: string
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
      code?: string
    }
  }
}

export interface BranchConfigModalProps {
  initialUrl: string
  initialBranch: string
  teamId: number
  onClose: () => void
  onSaved: () => void
}

export default function BranchConfigModal({
  initialUrl,
  initialBranch,
  teamId,
  onClose,
  onSaved,
}: BranchConfigModalProps) {
  const [url, setUrl] = useState(initialUrl)
  const [selectedBranch, setSelectedBranch] = useState(initialBranch)
  const [branches, setBranches] = useState<Branch[]>([])

  const {
    loading: branchLoading,
    error: branchError,
    execute: fetchBranches,
  } = useApi(getGithubBranchs)
  const { loading: saveLoading, execute: saveConfig } = useApi(updateGithubConfig)

  const branchApiError = branchError as ApiErrorResponse | null

  const handleFetchBranches = async () => {
    if (!url.trim()) return
    try {
      const result = (await fetchBranches(url.trim())) as { branches: Branch[] }
      setBranches(result.branches ?? [])
      if (
        result.branches?.length &&
        !result.branches.find((b: Branch) => b.name === selectedBranch)
      ) {
        setSelectedBranch(result.branches[0].name)
      }
    } catch {
      setBranches([])
    }
  }

  const handleSave = async () => {
    if (!selectedBranch || !url.trim()) return
    await saveConfig(teamId, { url: url.trim(), branch: selectedBranch })
    onSaved()
    onClose()
  }

  return (
    <Modal title='GitHub 설정 변경' size='md' onClose={onClose}>
      <div>
        <label className='block text-xs text-gray-500 mb-1.5 font-semibold'>Repository URL</label>
        <div className='flex gap-2 mb-4'>
          <input
            type='text'
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setBranches([])
              setSelectedBranch('')
            }}
            placeholder='https://github.com/org/repo'
            className='flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors'
          />
          <button
            onClick={handleFetchBranches}
            disabled={branchLoading || !url.trim()}
            className='cursor-pointer shrink-0 text-xs font-semibold pt-3 px-3 py-2 rounded-lg bg-gray-100 text-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          >
            {branchLoading ? '조회 중…' : '조회'}
          </button>
        </div>
        {branchApiError && (
          <p className='text-red-400 text-xs mb-3'>
            ⚠ {branchApiError?.response?.data?.message ?? '브랜치를 불러오지 못했습니다.'}
          </p>
        )}
        {branches.length > 0 && (
          <>
            <label className='block text-xs text-gray-500 mb-1.5 font-semibold'>Branch</label>
            <div className='border border-gray-200 rounded-lg overflow-hidden mb-5 max-h-52 overflow-y-auto'>
              {branches.map((branch) => (
                <button
                  key={branch.name}
                  onClick={() => setSelectedBranch(branch.name)}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedBranch === branch.name
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      selectedBranch === branch.name ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                  {branch.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className='flex gap-2 justify-end'>
          <button
            onClick={onClose}
            className='text-sm px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors'
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saveLoading || !selectedBranch || !url.trim()}
            className='text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          >
            {saveLoading ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
