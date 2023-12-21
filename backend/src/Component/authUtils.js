import Swal from 'sweetalert2';

export function checkTokenAndRedirect(navigate) {
  const storedToken = sessionStorage.getItem('Token');
  if (storedToken === null) {
    navigate('/');
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'กรุณาล็อคอิน',
      showConfirmButton: false,
      timer: 2500,
    })
  }
}
