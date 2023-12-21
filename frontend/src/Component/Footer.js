import React from 'react'
import 'aos/dist/aos.css'; // Import the CSS
import { Link } from 'react-router-dom';

export default function Footer() {

    return (
        <footer className='card card-shadow rounded-0 border-0 footer'>
            <div className='container'>
                <div class="row">
                    <div className='col-lg-6'>
                        <div className='fs-3 fw-bold detailnewsheader'>ติดต่อขอความช่วยเหลือเทศบาลตำบลแม่ยาว</div>
                        <p className='fs-5'>
                            200 บ้านห้วยทรายขาว หมู่ 3 ต.แม่ยาว อ.เมืองเชียงราย จังหวัดเชียงราย 57100
                        </p>
                    </div>
                    <div className='col-lg-6'>
                        <div className='fs-5'>กดโทรทันที</div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <i class="fa-solid fa-phone icon-footer fs-2"></i>
                                <a className='text-dark' href="tel:053737359">053-737-359</a>
                            </div>
                            <div className='col-lg-6'>
                                <i class="fa-brands fa-facebook icon-footer fs-2"></i>
                                <a className='text-dark' href="https://www.facebook.com/MaeyaoMunicipality/">@Maeyaomunicipality</a>
                            </div>
                            <div className='col-lg-6'>
                                <i class="fa-solid fa-globe icon-footer fs-2"></i>
                                <a className='text-dark' href="https://www.maeyao.go.th">เทศบาลตำบลแม่ยาว</a>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='text-end'>
                    <Link to={`/About`} className='text-black'>© มหาวิทยาลัยราชภัฏเชียงราย คณะสาธารณสุข และ คณะเทคโนโลยีดิจิตอล ปี2563</Link>
                </div>
            </div>

        </footer>
    )
}
