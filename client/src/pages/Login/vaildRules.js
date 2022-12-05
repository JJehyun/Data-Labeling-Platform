export const DateRules = {
    tooltip : "생년 월일을 선택해주세요!",
    rules: [
      {
        type: 'date',
        required: true,
        message: '생년월일을 지정해주세요!',
      }
    ],
  };

  export const EmailRules = {
    tooltip : "이메일 형식에 맞게 작성해주세요!",
    rules: [
      {
        required: true,
        pattern:/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
        message:"이메일 형식을 확인해주세요!"
      }
    ],
  };

  export const certifyRules = {
    tooltip : "인증번호를 입력해주세요!",
    rules: [
      {
        required: true,
        message: '인증번호를 확인해주세요!',
        whitespace: true,
      }
    ],
}
export const passwordRules = {
    tooltip : "비밀번호을 숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력해주세요!",
    rules: [
      {
        required: true,
        pattern:/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/,
        message:"비밀번호 형식을 확인해주세요!"
      }
    ],
}

export const nameRules = {
    tooltip : "성과 이름을 입력해주세요!",
    rules: [
      {
        required: true,
        message: '성과 이름을 입력해주세요!',
        whitespace: true,
      }
    ],
}
export const companyRules = {
    tooltip : "회사를 입력해주세요!",
    rules: [
      {
        required: true,
        message: '회사이름을 입력해주세요!',
        whitespace: true,
      }
    ],
}
export const phoneRules = {
    tooltip : "-제외 한 전화번호를 입력해주세요!",
    rules: [
      {
        required: true,
        pattern: /^[0-9]+$/,
        message: '-를 제외한 전화번호를 작성해주세요',
      }
    ],
}
export const bankNameRules = {
  tooltip : "은행명을 입력해주세요!",
  rules: [
    {
      type: 'array', required: true
    }
  ],
}
export const AccountRules = {
  tooltip : "계좌번호을 입력해주세요!",
  rules: [
    {
      required: true,
      pattern: /^[0-9]+$/,
      message: '-를 제외한 계좌번호를 작성해주세요',
    }
  ],
}
export const accountHolderRules = {
  tooltip : "예금주이름을 입력해주세요!",
  rules: [
    {
      required: true,
      message: '예금주이름을 입력해주세요!',
      whitespace: true,
    }
  ],
}
export const BankName = 
  [
    {
      value: '1',
      label: '시중 은행',
      children: [
        {
          value: '신한 은행',
          label: '신한 은행',
        },
        {
          value: '하나 은행',
          label: '하나 은행'
        },
        {
          value: '한국 외한',
          label: '한국 외한'
        },
        {
          value: '제일 은행',
          label: '제일 은행'
        },
        {
          value: '국민 은행',
          label: '국민 은행'
        },
        {
          value: '우리 은행',
          label: '우리 은행'
        },
        {
          value: '기업 은행',
          label: '기업 은행'
        }
      ],
    },  {
      value: '2',
      label: '지방 은행',
      children: [
        {
          value: '경남 은행',
          label: '경남 은행',
        },
        {
          value: '광주 은행',
          label: '광주 은행'
        },
        {
          value: '제주 외한',
          label: '제주 외한'
        },
        {
          value: '부산 은행',
          label: '부산 은행'
        },
        {
          value: '전북 은행',
          label: '전북 은행'
        },
        {
          value: '대구 은행',
          label: '대구 은행'
        },
        {
          value: '제주 은행',
          label: '제주 은행'
        }
      ],
    },
    {
      value: '3',
      label: '특수 은행',
      children: [
        {
          value: '산업 은행',
          label: '산업 은행',
        },
        {
          value: '중소 은행',
          label: '중소 은행'
        },
        {
          value: '농협중앙회',
          label: '농협중앙회'
        },
        {
          value: '수협 은행',
          label: '수협 은행'
        }
      ],
    },
    {
      value: '4',
      label: '인터넷 은행',
      children: [
        {
          value: '케이 뱅크',
          label: '케이 벵크',
        },
        {
          value: '카카오 뱅크',
          label: '카카오 뱅크'
        },
        {
          value: '토스 뱅크',
          label: '토스 뱅크'
        }
      ],
    },
    {
      value: '5',
      label: '외국 은행',
      children: [
        {
          value: '중국 은행',
          label: '중국 은행',
        },
        {
          value: 'ANZ은행',
          label: 'ANZ은행'
        },
        {
          value: 'DBS 은행',
          label: 'DBS 은행'
        },
        {
          value: '한국 씨티 은행',
          label: '한국 씨티 은행'
        }
      ],
    }
  ]



export const tailFormItemLayout = {
    wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 10,
        },
      },
}
export const formItemLayout = {
    labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 10,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
}

