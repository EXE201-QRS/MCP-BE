export const SERVICE_PLAN_MESSAGE = {
  CREATED_SUCCESSFUL: 'Tao gói dịch vụ thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật gói dịch vụ thành công',
  DELETED_SUCCESSFUL: 'Xóa gói dịch vụ thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách gói dịch vụ thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết gói dịch vụ thành công',
  ID_IS_INVALID: 'ID gói dịch vụ không hợp lệ',
  NAME_IS_REQUIRED: 'Tên gói dịch vụ là bắt buộc',
  PRICE_IS_INVALID: 'Giá gói dịch vụ không hợp lệ',
  DURATION_IS_INVALID: 'Thời gian sử dụng gói dịch vụ không hợp lệ'
} as const

export const CUSTOMER_FORM_MESSAGE = {
  CREATED_SUCCESSFUL: 'Tạo mẫu yêu cầu khách hàng thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật mẫu yêu cầu khách hàng thành công',
  DELETED_SUCCESSFUL: 'Xóa mẫu khách yêu cầu hàng thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách mẫu yêu cầu khách hàng thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết mẫu yêu cầu khách hàng thành công',
  ID_IS_INVALID: 'ID mẫu yêu cầu khách hàng không hợp lệ',
  NAME_IS_REQUIRED: 'Tên mẫu yêu cầu khách hàng là bắt buộc',
  PRICE_IS_INVALID: 'Giá mẫu yêu cầu khách hàng không hợp lệ',
  DURATION_IS_INVALID: 'Thời gian sử dụng mẫu yêu cầu khách hàng không hợp lệ',
  SERVICE_PLAN_ID_IS_INVALID: 'ID gói dịch vụ không hợp lệ'
} as const

export const SERVER_MESSAGE = {
  CREATED_SUCCESSFUL: 'Tạo máy chủ thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật máy chủ thành công',
  DELETED_SUCCESSFUL: 'Xóa máy chủ thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách máy chủ thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết máy chủ thành công',
  ID_IS_INVALID: 'ID máy chủ không hợp lệ',
  CUSTOMER_FORM_ID_IS_INVALID: 'ID form khách dịch vụ không hợp lệ'
} as const

export const CUSTOMER_MESSAGE = {
  RESTAURANT_TYPE_IS_REQUIRED: 'Restaurant type is required',
  RESTAURANT_NAME_IS_REQUIRED: 'Restaurant name is required',
  ID_IS_INVALID: 'Customer ID is invalid',
  PHONE_IS_INVALID: 'Customer phone number is invalid',
  CREATE_SUCCESS: 'Customer created successfully',
  UPDATED_SUCCESS: 'Customer updated successfully',
  DELETED_SUCCESS: 'Customer deleted successfully',
  GET_SUCCESS: 'Customer retrieved successfully',
  NOT_FOUND: 'Customer not found',
  ALREADY_EXISTS: 'Customer already exists',
  INVALID_DATA: 'Invalid customer data provided'
}

export const SUBSCRIPTION_MESSAGE = {
  RESTAURANT_NAME_IS_REQUIRED: 'Tên nhà hàng là bắt buộc',
  RESTAURANT_ADDRESS_IS_REQUIRED: 'Địa chỉ nhà hàng là bắt buộc',
  RESTAURANT_PHONE_IS_REQUIRED: 'Số điện thoại nhà hàng là bắt buộc',
  RESTAURANT_TYPE_IS_REQUIRED: 'Loại nhà hàng là bắt buộc',
  SERVICE_PLAN_ID_IS_INVALID: 'ID gói dịch vụ không hợp lệ',

  USER_ID_IS_INVALID: 'ID người dùng không hợp lệ',
  CREATED_SUCCESSFUL: 'Tạo đăng ký thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật đăng ký thành công',
  DELETED_SUCCESSFUL: 'Xóa đăng ký thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách đăng ký thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết đăng ký thành công',
  ID_IS_INVALID: 'ID đăng ký không hợp lệ',
  NAME_IS_REQUIRED: 'Tên đăng ký là bắt buộc',
  PRICE_IS_INVALID: 'Giá đăng ký không hợp lệ',
  DURATION_IS_INVALID: 'Thời gian sử dụng đăng ký không hợp lệ'
} as const

export const REVIEW_MESSAGE = {
  CONTENT_IS_REQUIRED: 'Nội dung đánh giá là bắt buộc',
  SUBSCRIPTION_ID_IS_INVALID: 'ID đăng ký không hợp lệ',
  CREATED_SUCCESSFUL: 'Tạo đánh giá thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật đánh giá thành công',
  DELETED_SUCCESSFUL: 'Xóa đánh giá thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách đánh giá thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết đánh giá thành công',
  ID_IS_INVALID: 'ID đánh giá không hợp lệ',
  USER_ID_IS_INVALID: 'ID người dùng không hợp lệ',

  RATING_IS_INVALID: 'Đánh giá không hợp lệ',
  COMMENT_IS_REQUIRED: 'Bình luận là bắt buộc'
}

export const PAYMENT_MESSAGE = {
  INVALID_INFORMATION: 'Thông tin thanh toán không hợp lệ',
  SERVICE_PLAN_NOT_FOUND: 'Gói dịch vụ không tồn tại',
  SUBSCRIPTION_NOT_FOUND: 'Đăng ký không tồn tại',
  SUBSCRIPTION_ID_IS_INVALID: 'ID đăng ký không hợp lệ',
  CREATED_SUCCESSFUL: 'Tạo thanh toán thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật thanh toán thành công',
  DELETED_SUCCESSFUL: 'Xóa thanh toán thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách thanh toán thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết thanh toán thành công',
  ID_IS_INVALID: 'ID thanh toán không hợp lệ',
  USER_ID_IS_INVALID: 'ID người dùng không hợp lệ',
  PAYMENT_METHOD_IS_REQUIRED: 'Phương thức thanh toán là bắt buộc',
  AMOUNT_IS_INVALID: 'Số tiền thanh toán không hợp lệ',
  STATUS_IS_INVALID: 'Trạng thái thanh toán không hợp lệ',
  PAYOS_ORDER_ID_IS_INVALID: 'ID đơn hàng PayOS không hợp lệ',
  PAYOS_PAYMENT_LINK_ID_IS_INVALID: 'ID liên kết thanh toán PayOS không hợp lệ',
  PAYOS_TRANSACTION_ID_IS_INVALID: 'ID giao dịch PayOS không hợp lệ',
  PAYOS_QR_CODE_IS_INVALID: 'Mã QR PayOS không hợp lệ',
  PAYOS_CHECKOUT_URL_IS_INVALID: 'URL thanh toán PayOS không hợp lệ'
}

export const QOS_INSTANCE_MESSAGE = {
  CREATED_SUCCESSFUL: 'Tạo QoS Instance thành công',
  UPDATED_SUCCESSFUL: 'Cập nhật QoS Instance thành công',
  DELETED_SUCCESSFUL: 'Xóa QoS Instance thành công',
  GET_ALL_SUCCESSFUL: 'Lấy danh sách QoS Instance thành công',
  GET_DETAIL_SUCCESSFUL: 'Lấy chi tiết QoS Instance thành công',
  ID_IS_INVALID: 'ID QoS Instance không hợp lệ',
  USER_ID_IS_INVALID: 'ID người dùng không hợp lệ',
  SUBSCRIPTION_ID_IS_INVALID: 'ID đăng ký không hợp lệ',
  RATING_IS_INVALID: 'Đánh giá không hợp lệ',
  CONTENT_IS_REQUIRED: 'Nội dung đánh giá là bắt buộc',
  STATUS_IS_INVALID: 'Trạng thái không hợp lệ',
  IS_PUBLIC_IS_INVALID: 'Trạng thái công khai không hợp lệ',
  REVIEW_FOR_IS_INVALID: 'Đối tượng đánh giá không hợp lệ'
}
