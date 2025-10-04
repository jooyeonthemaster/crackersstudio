import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dylloavkiyqfnqglaryw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Supabase 데이터베이스 설정 시작...\n');

  // 1. Books 테이블 생성
  console.log('📊 Books 테이블 생성 중...');

  const { data: tables, error: tableError } = await supabase
    .from('books')
    .select('id')
    .limit(1);

  if (tableError && tableError.code === '42P01') {
    // 테이블이 없으면 생성 필요
    console.log('⚠️  테이블이 없습니다. SQL을 수동으로 실행해야 합니다.');
    console.log('\n다음 단계를 따라주세요:');
    console.log('1. https://supabase.com/dashboard 로그인');
    console.log('2. 프로젝트 선택 (dylloavkiyqfnqglaryw)');
    console.log('3. SQL Editor 클릭');
    console.log('4. supabase-schema.sql 파일 내용 복사 & 실행\n');
    return;
  }

  // 2. 초기 데이터 삽입
  console.log('📝 초기 데이터 삽입 중...');

  const initialBooks = [
    {
      title: '토끼 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/38f44f6d8209f.png',
      audio_file: '/audio/rabbit.mp3',
      description: '귀여운 토끼 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 1
    },
    {
      title: '곰 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/9318aa38c687d.png',
      audio_file: '/audio/bear.mp3',
      description: '따뜻한 곰 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 2
    },
    {
      title: '고양이 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/e927347749a74.png',
      audio_file: '/audio/cat.mp3',
      description: '사랑스러운 고양이 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 3
    },
    {
      title: '여우 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/a5ed1506d849f.png',
      audio_file: '/audio/fox.mp3',
      description: '똑똑한 여우 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 4
    },
    {
      title: '사슴 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/cdb3d1e8d380a.png',
      audio_file: '/audio/deer.mp3',
      description: '우아한 사슴 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 5
    },
    {
      title: '펭귄 크랙이',
      author: 'Little Crack',
      cover_image: 'https://cdn.imweb.me/thumbnail/20250527/c5ea4ef8a3a7e.png',
      audio_file: '/audio/penguin.mp3',
      description: '깜찍한 펭귄 캐릭터입니다',
      genre: 'Character',
      published_year: 2024,
      display_order: 6
    }
  ];

  const { data, error } = await supabase
    .from('books')
    .upsert(initialBooks, { onConflict: 'id' });

  if (error) {
    console.error('❌ 데이터 삽입 실패:', error.message);
    return;
  }

  console.log('✅ 초기 데이터 삽입 완료!');

  // 3. 데이터 확인
  const { data: allBooks, error: selectError } = await supabase
    .from('books')
    .select('*')
    .order('display_order', { ascending: true });

  if (selectError) {
    console.error('❌ 데이터 조회 실패:', selectError.message);
    return;
  }

  console.log('\n📚 현재 저장된 책 목록:');
  console.table(allBooks);

  console.log('\n✨ 설정 완료! 어드민 페이지에서 확인하세요.');
}

setupDatabase().catch(console.error);
