
import { ProfileData } from './types';

export const INITIAL_DATA: ProfileData = {
  name: "장동천",
  // 사용자가 업로드한 사진을 profile.jpg로 저장한다고 가정합니다.
  profileImageUrl: "./profile.jpg",
  headline: "움직임에 확신을 더하는\n물리치료사 장동천",
  subHeadline: "서울의료원 물리치료사 | KPNFA 학술 부장 및 실기 강사 | 이학석사(M.S.)",
  philosophy: "저는 단순 암기식 교육이 아닌, 실제 임상 사례와 이론을 연결하여 실질적인 변화를 제공하는 교육과 치료를 추구합니다. 서울의료원에서의 풍부한 임상 경험을 바탕으로, 전문적 지식과 기술뿐만 아니라 사명감을 갖춘 치료사로서 환자의 독립적인 삶을 위해 헌신합니다.",
  philosophyHighlight: "이론과 실제의 일치를 통해 환자에게 최고의 임상 결과를 제공합니다.",
  email: "sgpt1404@naver.com",
  phone: "010-7474-9803",
  expertise: [
    { label: "임상 경력", value: "6년+" },
    { label: "자격/이수", value: "33건" },
    { label: "교육 강연", value: "KPNFA 강사" },
    { label: "전문 분야", value: "신경/근골격" }
  ],
  experience: [
    { id: "exp-1", year: "2024.04.01 ~ 현재", title: "서울의료원 재활의학팀", description: "신경계 운동치료, 수술 후 재활, 심폐 재활 및 중증 환자 관리" },
    { id: "exp-2", year: "2023.05.03 ~ 2024.03.31", title: "의정부 을지대학교병원 의료기사총괄부", description: "신경계 및 수술 후 재활 전문 치료" },
    { id: "exp-3", year: "2020.08.05 ~ 2022.08.04", title: "건국대학교병원 재활의학팀", description: "신경계 운동치료, 수술 후 재활, 호흡 재활" },
    { id: "exp-4", year: "2019.03.01 ~ 2020.03.01", title: "삼육서울병원 재활의학팀", description: "신경계 운동치료, 수술 후 재활, 호흡 재활" }
  ],
  education: [
    { id: "edu-1", year: "2023.03 ~ 2025.02", degree: "이학석사 (근골격계물리치료전공)", institution: "삼육대학교 대학원" },
    { id: "edu-2", year: "2019.03 ~ 2020.02", degree: "물리치료학사", institution: "신구대학교" },
    { id: "edu-3", year: "2014.03 ~ 2019.02", degree: "물리치료전문학사", institution: "신구대학교" }
  ],
  certifications: [
    { id: "cert-1", date: "2019.02.11", title: "물리치료사 면허증", organization: "보건복지부" },
    { id: "cert-2", date: "2019.02.16", title: "OMPT for Introduction Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-3", date: "2019.04.07", title: "BOBATH Introduction Course", organization: "한국보바스협회" },
    { id: "cert-4", date: "2019.10.13", title: "KPNFA Certificate of Basic Course", organization: "대한고유수용성신경근진법학회" },
    { id: "cert-5", date: "2020.05.10", title: "KPNFA Certificate of Advanced Course", organization: "대한고유수용성신경근진법학회" },
    { id: "cert-6", date: "2020.09.13", title: "KACRPT-Basic Course", organization: "대한심장호흡물리치료학회" },
    { id: "cert-7", date: "2020.10.18", title: "KACRPT-Intermediate Course", organization: "대한심장호흡물리치료학회" },
    { id: "cert-8", date: "2023.03.12", title: "Clinical Practice Guideline Spine Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-9", date: "2023.03.26", title: "Evidence Based Practice Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-10", date: "2023.04.09", title: "Clinical Neurodynamic Technique Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-11", date: "2023.04.23", title: "Cervicothoracic Basic Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-12", date: "2023.05.07", title: "Cervicothoracic Intermediate Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-13", date: "2023.05.14", title: "Basic of Lumbopelvic Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-14", date: "2023.05.28", title: "Intermediate of Lumbar Spine course", organization: "대한정형도수물리치료학회" },
    { id: "cert-15", date: "2023.06.11", title: "Intermediate of Pelvic Girdle course", organization: "대한정형도수물리치료학회" },
    { id: "cert-16", date: "2023.08.27", title: "Basic Course of Upper Extremity", organization: "대한정형도수물리치료학회" },
    { id: "cert-17", date: "2023.09.10", title: "Intermediate Course of Upper Extremity", organization: "대한정형도수물리치료학회" },
    { id: "cert-18", date: "2023.09.24", title: "Special Joint Technique Ⅰ", organization: "대한정형도수물리치료학회" },
    { id: "cert-19", date: "2023.10.22", title: "Functional Taping Technique", organization: "대한정형도수물리치료학회" },
    { id: "cert-20", date: "2023.10.29", title: "Basic of Lower Extremity Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-21", date: "2023.11.12", title: "Intermediate of Lower Extremity Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-22", date: "2023.11.26", title: "Muscle Energy Technique Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-23", date: "2023.12.10", title: "Special Exercise Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-24", date: "2024.03.10", title: "Radiology Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-25", date: "2024.03.31", title: "Mobilization Pysiologic Movement Course", organization: "대한정형도수물리치료학회" },
    { id: "cert-26", date: "2024.04.21", title: "spinal manipulation technique Ⅱ", organization: "대한정형도수물리치료학회" },
    { id: "cert-27", date: "2024.10.13", title: "IPNFA Level Ⅰ & Ⅱ Course", organization: "대한고유수용성신경근진법학회" },
    { id: "cert-28", date: "2025.03.30", title: "IPNFA Level 3a Course", organization: "대한고유수용성신경근진법학회" },
    { id: "cert-29", date: "2025.05.10", title: "ADVANCED SPORT NUTRITION COACH", organization: "NSCA Korea" },
    { id: "cert-30", date: "2025.08.09", title: "Redcord Intro Workshop", organization: "Redbalance" },
    { id: "cert-31", date: "2025.10.17", title: "NSCA - CPT", organization: "National Strength and Conditioning Association" },
    { id: "cert-32", date: "2025.12.05", title: "생활체육지도사 2급", organization: "문화체육관광부" },
    { id: "cert-33", date: "2025.12.07", title: "정형도수물리치료사", organization: "대한정형도수물리치료학회" }
  ],
  portfolioItems: [],
  certificationImages: []
};
