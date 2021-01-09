package forms

import (
	"math/rand"
	"time"

	"github.com/porter-dev/porter/internal/models"
)

const randCharset string = "abcdefghijklmnopqrstuvwxyz1234567890"

// CreateECRInfra represents the accepted values for creating an
// ECR infra via the provisioning container
type CreateECRInfra struct {
	ECRName          string `json:"ecr_name" form:"required"`
	ProjectID        uint   `json:"project_id" form:"required"`
	AWSIntegrationID uint   `json:"aws_integration_id" form:"required"`
}

// ToAWSInfra converts the form to a gorm aws infra model
func (ce *CreateECRInfra) ToAWSInfra() (*models.AWSInfra, error) {
	return &models.AWSInfra{
		Kind:             models.AWSInfraECR,
		ProjectID:        ce.ProjectID,
		Suffix:           stringWithCharset(6, randCharset),
		Status:           models.StatusCreating,
		AWSIntegrationID: ce.AWSIntegrationID,
	}, nil
}

// CreateEKSInfra represents the accepted values for creating an
// EKS infra via the provisioning container
type CreateEKSInfra struct {
	EKSName          string `json:"eks_name" form:"required"`
	ProjectID        uint   `json:"project_id" form:"required"`
	AWSIntegrationID uint   `json:"aws_integration_id" form:"required"`
}

// ToAWSInfra converts the form to a gorm aws infra model
func (ce *CreateEKSInfra) ToAWSInfra() (*models.AWSInfra, error) {
	return &models.AWSInfra{
		Kind:             models.AWSInfraEKS,
		ProjectID:        ce.ProjectID,
		Suffix:           stringWithCharset(6, randCharset),
		Status:           models.StatusCreating,
		AWSIntegrationID: ce.AWSIntegrationID,
	}, nil
}

// DestroyECRInfra represents the accepted values for destroying an
// ECR infra via the provisioning container
type DestroyECRInfra struct {
	ECRName string `json:"ecr_name" form:"required"`
}

// DestroyEKSInfra represents the accepted values for destroying an
// EKS infra via the provisioning container
type DestroyEKSInfra struct {
	EKSName string `json:"eks_name" form:"required"`
}

// helpers for random string
var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

// stringWithCharset returns a random string by pulling from a given charset
func stringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}